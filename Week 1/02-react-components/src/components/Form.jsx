import React, { useState } from 'react';
import Button from './Button';
import '../styles/components.css';

/**
 * Reusable Controlled Form Component
 * @param {Object} props
 * @param {string} [props.title='Create New Component Card']
 * @param {string} [props.subtitle='Add dynamic data to the React state list']
 * @param {Function} props.onSubmit - Callback receiving form data object: ({ title, description, category, tags, priority, icon })
 * @param {Array<string>} [props.categories] - Available category options
 */
export default function Form({
  title = 'Create New Component Card',
  subtitle = 'Demonstrates controlled inputs, validation & reactive state updating',
  onSubmit,
  categories = ['Frontend', 'Backend', 'Database', 'Architecture', 'DevOps', 'UI/UX'],
}) {
  const initialFormData = {
    title: '',
    category: 'Frontend',
    priority: 'medium',
    description: '',
    tagsInput: '',
    icon: '⚡',
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const icons = ['⚡', '⚛️', '🚀', '🛠️', '🎨', '🛡️', '📦', '🔥', '💡'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear field error on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required (minimum 3 characters)';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters long';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 8) {
      newErrors.description = 'Description must be at least 8 characters';
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    // Parse comma-separated tags
    const processedTags = formData.tagsInput
      ? formData.tagsInput
          .split(',')
          .map((t) => t.trim())
          .filter((t) => t.length > 0)
      : ['React', formData.category];

    const newCardData = {
      title: formData.title.trim(),
      category: formData.category,
      priority: formData.priority,
      description: formData.description.trim(),
      tags: processedTags,
      icon: formData.icon,
      likes: 0,
      completed: false,
    };

    if (onSubmit) {
      onSubmit(newCardData);
    }

    // Reset Form
    setFormData(initialFormData);
    setErrors({});
    setIsSubmitting(false);
    setSuccessMsg('Card created successfully and added to dynamic state!');

    setTimeout(() => {
      setSuccessMsg('');
    }, 4000);
  };

  return (
    <div className="component-form">
      <div className="component-form__header">
        <h3 className="component-form__title">{title}</h3>
        {subtitle && <p className="component-form__subtitle">{subtitle}</p>}
      </div>

      {successMsg && (
        <div className="component-form__alert component-form__alert--success" role="alert">
          ✓ {successMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="component-form__body" noValidate>
        {/* Title Input */}
        <div className="form-group">
          <label htmlFor="form-title" className="form-group__label">
            Card Title <span className="form-group__required">*</span>
          </label>
          <input
            id="form-title"
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. State Management with Redux Toolkit"
            className={`form-group__input ${errors.title ? 'is-invalid' : ''}`}
          />
          {errors.title && <span className="form-group__error">{errors.title}</span>}
        </div>

        {/* Category & Priority Grid */}
        <div className="form-row">
          <div className="form-group form-col">
            <label htmlFor="form-category" className="form-group__label">
              Category
            </label>
            <select
              id="form-category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="form-group__select"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group form-col">
            <label htmlFor="form-priority" className="form-group__label">
              Priority
            </label>
            <select
              id="form-priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="form-group__select"
            >
              <option value="high">🔥 High</option>
              <option value="medium">⚡ Medium</option>
              <option value="low">🌱 Low</option>
            </select>
          </div>

          <div className="form-group form-col">
            <label htmlFor="form-icon" className="form-group__label">
              Icon Symbol
            </label>
            <select
              id="form-icon"
              name="icon"
              value={formData.icon}
              onChange={handleChange}
              className="form-group__select"
            >
              {icons.map((ic) => (
                <option key={ic} value={ic}>
                  {ic}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Description Textarea */}
        <div className="form-group">
          <label htmlFor="form-description" className="form-group__label">
            Description <span className="form-group__required">*</span>
          </label>
          <textarea
            id="form-description"
            name="description"
            rows="3"
            value={formData.description}
            onChange={handleChange}
            placeholder="Explain what this component or concept demonstrates..."
            className={`form-group__textarea ${errors.description ? 'is-invalid' : ''}`}
          ></textarea>
          {errors.description && (
            <span className="form-group__error">{errors.description}</span>
          )}
        </div>

        {/* Tags input */}
        <div className="form-group">
          <label htmlFor="form-tags" className="form-group__label">
            Tags (comma-separated)
          </label>
          <input
            id="form-tags"
            type="text"
            name="tagsInput"
            value={formData.tagsInput}
            onChange={handleChange}
            placeholder="React, Hooks, JSX, Architecture"
            className="form-group__input"
          />
        </div>

        {/* Submit Actions */}
        <div className="component-form__actions">
          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isSubmitting}
            icon="➕"
          >
            Add Card to State
          </Button>

          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={() => {
              setFormData(initialFormData);
              setErrors({});
            }}
          >
            Reset Form
          </Button>
        </div>
      </form>
    </div>
  );
}
