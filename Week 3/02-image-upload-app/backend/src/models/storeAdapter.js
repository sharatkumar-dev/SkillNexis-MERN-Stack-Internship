const mongoose = require('mongoose');
const ImageMongoose = require('./Image');

// In-Memory fallback store when MongoDB local/Atlas instance is not connected
const memoryImages = [];

// Helper to generate 24-character MongoDB-compatible hex ID
const generateId = () => {
  const timestamp = Math.floor(Date.now() / 1000).toString(16).padStart(8, '0');
  const random = Array.from({ length: 16 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join('');
  return timestamp + random;
};

// Format bytes helper
const formatBytes = (bytes) => {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const isDbConnected = () => mongoose.connection.readyState === 1;

const ImageStore = {
  isDbConnected,

  async create(imageData) {
    if (isDbConnected()) {
      const doc = new ImageMongoose(imageData);
      return await doc.save();
    }

    const now = new Date();
    const newDoc = {
      _id: generateId(),
      title: imageData.title,
      description: imageData.description || '',
      category: imageData.category || 'general',
      tags: imageData.tags || [],
      filename: imageData.filename,
      originalName: imageData.originalName,
      mimeType: imageData.mimeType,
      size: imageData.size,
      filePath: imageData.filePath,
      url: imageData.url,
      formattedSize: formatBytes(imageData.size),
      createdAt: now,
      updatedAt: now
    };

    memoryImages.unshift(newDoc);
    return newDoc;
  },

  async insertMany(docsArray) {
    if (isDbConnected()) {
      return await ImageMongoose.insertMany(docsArray);
    }

    const created = [];
    for (const item of docsArray) {
      const doc = await this.create(item);
      created.push(doc);
    }
    return created;
  },

  find(query = {}) {
    if (isDbConnected()) {
      return ImageMongoose.find(query);
    }

    // Filter memoryImages
    let results = memoryImages.filter((img) => {
      // Category filter
      if (query.category && img.category.toLowerCase() !== query.category.toLowerCase()) {
        return false;
      }

      // Search $or filter
      if (query.$or && Array.isArray(query.$or)) {
        const titleRegex = query.$or[0]?.title;
        if (titleRegex && titleRegex instanceof RegExp) {
          const matchTitle = titleRegex.test(img.title);
          const matchDesc = titleRegex.test(img.description);
          const matchTags = img.tags.some((t) => titleRegex.test(t));
          const matchOriginal = titleRegex.test(img.originalName);
          if (!matchTitle && !matchDesc && !matchTags && !matchOriginal) {
            return false;
          }
        }
      }

      return true;
    });

    let sortFn = (a, b) => new Date(b.createdAt) - new Date(a.createdAt);
    let skipVal = 0;
    let limitVal = 50;

    const queryChain = {
      sort(sortObj) {
        if (sortObj.createdAt === 1) {
          sortFn = (a, b) => new Date(a.createdAt) - new Date(b.createdAt);
        } else if (sortObj.size === -1) {
          sortFn = (a, b) => b.size - a.size;
        } else if (sortObj.size === 1) {
          sortFn = (a, b) => a.size - b.size;
        } else if (sortObj.title === 1) {
          sortFn = (a, b) => a.title.localeCompare(b.title);
        }
        return this;
      },
      skip(val) {
        skipVal = val;
        return this;
      },
      limit(val) {
        limitVal = val;
        return this;
      },
      then(resolve, reject) {
        const sorted = [...results].sort(sortFn);
        const paged = sorted.slice(skipVal, skipVal + limitVal);
        return Promise.resolve(paged).then(resolve, reject);
      },
      catch(reject) {
        return this.then(undefined, reject);
      }
    };

    return queryChain;
  },

  async countDocuments(query = {}) {
    if (isDbConnected()) {
      return await ImageMongoose.countDocuments(query);
    }

    const items = await this.find(query).limit(1000000);
    return items.length;
  },

  async findById(id) {
    if (isDbConnected()) {
      return await ImageMongoose.findById(id);
    }

    return memoryImages.find((img) => String(img._id) === String(id)) || null;
  },

  async findByIdAndDelete(id) {
    if (isDbConnected()) {
      return await ImageMongoose.findByIdAndDelete(id);
    }

    const index = memoryImages.findIndex((img) => String(img._id) === String(id));
    if (index !== -1) {
      const [removed] = memoryImages.splice(index, 1);
      return removed;
    }
    return null;
  },

  async getStorageStats() {
    if (isDbConnected()) {
      const totalCount = await ImageMongoose.countDocuments();
      const aggregateResult = await ImageMongoose.aggregate([
        {
          $group: {
            _id: '$category',
            count: { $sum: 1 },
            totalBytes: { $sum: '$size' }
          }
        }
      ]);

      const totalBytes = aggregateResult.reduce((acc, curr) => acc + (curr.totalBytes || 0), 0);
      const categories = aggregateResult.map((item) => ({
        category: item._id || 'general',
        count: item.count,
        totalBytes: item.totalBytes,
        formattedSize: formatBytes(item.totalBytes)
      }));

      return {
        totalImages: totalCount,
        totalBytes,
        formattedTotalSize: formatBytes(totalBytes),
        categories
      };
    }

    // In-memory stats calculation
    const totalCount = memoryImages.length;
    const totalBytes = memoryImages.reduce((sum, img) => sum + (img.size || 0), 0);

    const categoryMap = {};
    memoryImages.forEach((img) => {
      const cat = img.category || 'general';
      if (!categoryMap[cat]) {
        categoryMap[cat] = { count: 0, totalBytes: 0 };
      }
      categoryMap[cat].count += 1;
      categoryMap[cat].totalBytes += img.size || 0;
    });

    const categories = Object.keys(categoryMap).map((cat) => ({
      category: cat,
      count: categoryMap[cat].count,
      totalBytes: categoryMap[cat].totalBytes,
      formattedSize: formatBytes(categoryMap[cat].totalBytes)
    }));

    return {
      totalImages: totalCount,
      totalBytes,
      formattedTotalSize: formatBytes(totalBytes),
      categories
    };
  }
};

module.exports = {
  ImageStore
};
