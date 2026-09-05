import os
import subprocess
import sys

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SCREENSHOTS_DIR = os.path.join(BASE_DIR, "screenshots")
CODE_DIR = os.path.join(BASE_DIR, "code")

os.makedirs(SCREENSHOTS_DIR, exist_ok=True)
os.makedirs(CODE_DIR, exist_ok=True)

items = [
    {
        "name": "01_design_system_thumbnail",
        "screenshot_url": "https://lh3.googleusercontent.com/aida/AEtjO1WrAA7q2KXNOz3ltR5w9x30FazRi6rX8RGe3X5ErUzBrt-RN458jwTJAhmO8V30lw68raH9T25k6kYFBMcWgG0fJbkTdy6OijvPPazDukG0_oaV9LE_qOGbke6UIIvzIiZocubl3pMDSz7YNQs76iZ5P_jXx2cJaRS3wzZjDVtOeRmPBneJ5Xbm8aSBi_oVvd0T6tbDgn6sgooaxVAVHf0lWKSBrQ9xCx_ulWuJmoNB_MkP6WRZvgCmIiQ",
        "screenshot_dest": os.path.join(SCREENSHOTS_DIR, "01-design-system-thumbnail.png"),
        "code_url": None,
        "code_dest": None
    },
    {
        "name": "02_nexisstore_logo",
        "screenshot_url": "https://lh3.googleusercontent.com/aida/AEtjO1V3rsr5GLRIWD1fvViOOTAQx6_i92fvZpztEPRM85DLywIKoy4OHriodLT38DDXtPuHK-PpwAoqJrTWmn4GhERFBR6LXu6TJp224JnLEnD4LCzR4qGxsPi8d9BJQ61W4WhbVAgHDUOLucOoP486bQ5I1dAE_WVugOv7BtymBPM3a7oQwjp5Sw5t-g-f_CTqgkzRitDrRA7zdSnbQ-iTXVLE1Pl8zlx8l1qQoUV1hX90j50t-qsYckcHcqyI",
        "screenshot_dest": os.path.join(SCREENSHOTS_DIR, "02-nexisstore-logo.png"),
        "code_url": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1YWJjYTBiMTVmMTIwN2M0ZTJkYzU2MWY5NzJlEgsSBxCPke6apRQYAZIBJAoKcHJvamVjdF9pZBIWQhQxNjM4NzY2NTczNTE5OTUwNzI2Ng&filename=&opi=89354086",
        "code_dest": os.path.join(CODE_DIR, "02-nexisstore-logo.svg")
    },
    {
        "name": "03_product_detail_cart_drawer",
        "screenshot_url": "https://lh3.googleusercontent.com/aida/AEtjO1VZjTfXZMb62MsHPIb9lIvYWO4SEafyxIHUOoZYF-VaOlsaQXF1oDcwYHPnaORgW91T4mpQ-EZJpILQ4RAHGqbKZmcp92aJmHNbH29mZ8k2JVJyO8Md8uy2cOmJvDZbb7JPPF1xR5_yOSCFLO6MLjDJcaApXOrsDqR8idWcKSI1oFZw81mH-6Gqq3-Fh5L2vlu_gq7Cq_zpBCz0X9_Wt_qMMYZ_L1O7lARxRmrZ37JXEFXzPLU3CkX2aI_s",
        "screenshot_dest": os.path.join(SCREENSHOTS_DIR, "03-product-detail-cart-drawer.png"),
        "code_url": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1YWJjYThhOTI5NzcwMzZjNzk1ZDI1MGRjZmRjEgsSBxCPke6apRQYAZIBJAoKcHJvamVjdF9pZBIWQhQxNjM4NzY2NTczNTE5OTUwNzI2Ng&filename=&opi=89354086",
        "code_dest": os.path.join(CODE_DIR, "03-product-detail-cart-drawer.html")
    },
    {
        "name": "04_storefront_dynamic_catalog",
        "screenshot_url": "https://lh3.googleusercontent.com/aida/AEtjO1X7LmmECTtgtgSeWUsCnBTaM-RMjQ8ujK1928imDOBYYgiGVz-CmAgQbtMcnkr4c_ocMEflxJ0_sNcKa9pwViZjtz5mvjfyPW3IMfPWYeyBEQ35t4uTzkO8Iq91ODnfkNLHQW0qZfF0Uw1qTR_w9OYVQEvUhKrNULCDS7HrsyoiLg19h4jcg-jvWpHJiRLi5hEPBQTC9UnSmrUV22BffQgcbPxPOLu-jC0_VdsHVAxMjCKpEw-y1d7wxw0",
        "screenshot_dest": os.path.join(SCREENSHOTS_DIR, "04-storefront-dynamic-catalog.png"),
        "code_url": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1YWJjYTg3YmMyZDIwMzZjN2QwNjg5MTE1Y2I1EgsSBxCPke6apRQYAZIBJAoKcHJvamVjdF9pZBIWQhQxNjM4NzY2NTczNTE5OTUwNzI2Ng&filename=&opi=89354086",
        "code_dest": os.path.join(CODE_DIR, "04-storefront-dynamic-catalog.html")
    },
    {
        "name": "05_multistep_checkout_live_tracking",
        "screenshot_url": "https://lh3.googleusercontent.com/aida/AEtjO1XJGKMSdSISyGmS_k3uRQxY7QWlFGupsvTAGj6JR6g0ieTkltjLF9MIpD1NJb-dauCAFu_FFvIp_A8t0MCj6cMgTOJuNDMXmJs7k7lPZ0rys8jn0O_inxEvuK4-cQNjmJD_nceScnBiEcYPIonRTmhDYWsaPJ4hlskxwrbtQvx3IJ-7RJ-9_OgGZ4s4-l0wHQjmkDfw5Gj5llSdYRb4nrNHO1QWGYc5EiwPzNA1DruJ6pulNUEuJRSq1tIG",
        "screenshot_dest": os.path.join(SCREENSHOTS_DIR, "05-multistep-checkout-tracking.png"),
        "code_url": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1YWJjYTVkZjA0M2QwNzNhZmIxODY4MjE1OGM1EgsSBxCPke6apRQYAZIBJAoKcHJvamVjdF9pZBIWQhQxNjM4NzY2NTczNTE5OTUwNzI2Ng&filename=&opi=89354086",
        "code_dest": os.path.join(CODE_DIR, "05-multistep-checkout-tracking.html")
    },
    {
        "name": "06_admin_backoffice_catalog_control",
        "screenshot_url": "https://lh3.googleusercontent.com/aida/AEtjO1XHc0yy6Q4GapvWLGg5WjtdD1cC6PkqtZGt0JYKA8IBL5n6t6dr-sUMGXhEJZ_0pvCkijzb6LvM-IHbAg7T8mB8Ve-NsC4AHJLoQx_mIkcdgzVqVPFTovQyiYnyJ20WP98OM9tDoVLP9L5Bsd3zEzHNnLqFEP3qE8JkW7_rLtqpGdEIy6PgGXRI6o6sH80MUoA-DOCVGk1KQago2KF0bki75AE-qnpWW4cX7oH8IXc51XAIqXo5MFRHFsZs",
        "screenshot_dest": os.path.join(SCREENSHOTS_DIR, "06-admin-backoffice-catalog.png"),
        "code_url": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1YWJjZDE5ZTVhZWMwNmZmYzkwYzZhMjI3YzQ0EgsSBxCPke6apRQYAZIBJAoKcHJvamVjdF9pZBIWQhQxNjM4NzY2NTczNTE5OTUwNzI2Ng&filename=&opi=89354086",
        "code_dest": os.path.join(CODE_DIR, "06-admin-backoffice-catalog.html")
    },
    {
        "name": "07_customer_account_vault",
        "screenshot_url": "https://lh3.googleusercontent.com/aida/AEtjO1WnOICW3RvgW-Mlo87Bj3qL2qbyDq2Fm6HNxvHoYXEa9q_B4tGFtOl6bxNAehMw6PfnSUpO9M4V_nEjdCbXSpRmqYt108Jhbxq1e02OWN3fpemHfyigZgwTSiVl94AUwuLTwFg3irBVrmnqFdEZl3DcvG_w1iEPaOje9d4CQ0-j06CKx_GNe-wZIKLH_6_LX8JyBZLtvBuTz0ibzdiE9f1WRo4UDFq7wFFkcAOMug6A7Gq5yRhiLpPSU1ba",
        "screenshot_dest": os.path.join(SCREENSHOTS_DIR, "07-customer-account-vault.png"),
        "code_url": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1YWJkMDg0YzIxMjgwN2M0ZTQxZWJjMmM0NGY2EgsSBxCPke6apRQYAZIBJAoKcHJvamVjdF9pZBIWQhQxNjM4NzY2NTczNTE5OTUwNzI2Ng&filename=&opi=89354086",
        "code_dest": os.path.join(CODE_DIR, "07-customer-account-vault.html")
    },
    {
        "name": "08_admin_sku_restock",
        "screenshot_url": "https://lh3.googleusercontent.com/aida/AEtjO1UuxCMccvWIaYmOfSAASMTgFTkZ3R3DtCkKkRLnTI-VlHHKXPDbdklBh70_cKXn3r571Hw3Aad1a3HilRiekrwLS0YW0uVsUXOLuDh5ApTig2Fa9nCJ4sUswv2gsVnHt6yDnVd9CVvNTUJe4ghQtQLkEOBnWFI4Wf13MxR6IybaD_vBBtLRIc6b-J0jssHZNMQYgK-e6pa2DXqr7_Yr4ILB8_Hb618B4WVuPiML3AYb3T7ScjBjLx6Z85ch",
        "screenshot_dest": os.path.join(SCREENSHOTS_DIR, "08-admin-sku-restock.png"),
        "code_url": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1YWJkMDdmMmY2YWMwNzNhZmIxODY4MjE1OGM1EgsSBxCPke6apRQYAZIBJAoKcHJvamVjdF9pZBIWQhQxNjM4NzY2NTczNTE5OTUwNzI2Ng&filename=&opi=89354086",
        "code_dest": os.path.join(CODE_DIR, "08-admin-sku-restock.html")
    },
    {
        "name": "09_hardware_support_rma",
        "screenshot_url": "https://lh3.googleusercontent.com/aida/AEtjO1WPTiZbtI2mq154aHgECEc_TA0BxvC55ZC-mmwkyQAU1kgFyWoC748gR-DjsjaZ0fKrAnr54V2xjziU5_HMGxJu7uIWKRC1e2nokZxrZ862MQE8W27jRxzbsyR67jC7cLBz3Xz8Xheeg-EkPGUZVcJ0SMjSnNj9iHGeXfGb75fm24ibNpFJWfs-o1jVQQu5_3wy1s5KAoiE-wO4V88O5hXl1ZhjAlZprtosSh4R_bGXC-yEV-5urjh4Rnmi",
        "screenshot_dest": os.path.join(SCREENSHOTS_DIR, "09-hardware-support-rma.png"),
        "code_url": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1YWJkMDg2YzM3MzIwMzgzODZkZjcyMTAxNjI2EgsSBxCPke6apRQYAZIBJAoKcHJvamVjdF9pZBIWQhQxNjM4NzY2NTczNTE5OTUwNzI2Ng&filename=&opi=89354086",
        "code_dest": os.path.join(CODE_DIR, "09-hardware-support-rma.html")
    }
]

success = True
for item in items:
    if item["screenshot_url"]:
        print(f"Downloading screenshot: {os.path.basename(item['screenshot_dest'])} ...")
        cmd = ["curl.exe", "-L", "-s", item["screenshot_url"], "-o", item["screenshot_dest"]]
        res = subprocess.run(cmd)
        if res.returncode != 0:
            print(f"Error downloading screenshot {item['name']}")
            success = False
    if item["code_url"]:
        print(f"Downloading code: {os.path.basename(item['code_dest'])} ...")
        cmd = ["curl.exe", "-L", "-s", item["code_url"], "-o", item["code_dest"]]
        res = subprocess.run(cmd)
        if res.returncode != 0:
            print(f"Error downloading code {item['name']}")
            success = False

if success:
    print("ALL_DOWNLOADS_SUCCESSFUL")
else:
    print("SOME_DOWNLOADS_FAILED")
