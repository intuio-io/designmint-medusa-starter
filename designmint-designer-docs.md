---
description: >-
  DesignMint is a next-generation Web2Print Designer built to power
  customization experiences for e-commerce products—from apparel to merchandise
  and more.
---

# DesignMint Designer Docs

### 🖌️ Introduction to DesignMint

**DesignMint** is a next-generation **Web2Print Designer** built to power customization experiences for e-commerce products—from apparel to merchandise and more.

Unlike traditional print designers, DesignMint connects directly to your e-commerce backend, understands product templates, and offers an intuitive, responsive, and production-ready design surface.

It’s the perfect bridge between **great user experience** and **error-free order fulfillment**.

***

### 🚀 Features of DesignMint

#### ✏️ Text Tools

* Rich Text Editing: Bold, Italics, Underline
* Custom Fonts (Google Fonts + Uploaded)
* Letter Spacing Control
* Line Height Control
* Text Alignment (Left, Center, Right)
* Inline Toolbar for fast editing
* Snap to Grid for perfect placement

{% embed url="https://www.youtube.com/watch?v=9dX-pBUJmt8" %}

#### 🎨 Visual Tools

* Icon Library (Preloaded assets)
* Upload custom images
* Color fill controls
* SVG support
  * SVG Edit support
  * Copy/Paste SVG files directly
* Clip Masking (Cut images to shapes)

{% embed url="https://youtu.be/-JrrUhvLmR0" %}

#### 📐 Layout Tools

* Layer Management
  * Move up/down
  * Group/Ungroup
* Pan/Zoom on Canvas
* Keyboard Shortcuts for fast editing
* Auto-alignment guidelines with Snap-to-Grid

{% embed url="https://youtu.be/_6gPAqnwzdo" %}

#### 🛠️ Admin Controls

* Define customizable design areas per product
* Upload templates with safe zone / cut line indicators
* Create product-specific customization rules
* View live previews of end-user designs

{% embed url="https://youtu.be/9U1q1DSn1i8" %}

***

### ⚙️ Starter Deployment Guide

DesignMint ships with a **Medusa Starter Template** for quick integration into your commerce backend and frontend.

#### 🏗️ Local Development

1. Clone the starter repo (access required).
2.  Install dependencies:

    ```bash
    yarn install

    ```
3. Setup environment variables:
   * Backend URL
   * API Keys
4.  Run backend and frontend locally:

    ```bash
    yarn dev

    ```

#### ☁️ Cloud Deployment: GCP

We recommend using **Google Cloud Run** for a fully managed deployment:

* Containerize the backend + frontend separately.
* Use Cloud Build triggers for CI/CD pipelines.
* Use GCP Load Balancer for SSL and domain management.
* Connect to GCP SQL for database storage.
* Store uploaded assets via GCP Storage Buckets.

**Deployment Templates** and examples are available for authorized users.

***

### 🔐 Licensing

> Private License
>
> DesignMint is a **proprietary, closed-source** product.
>
> Use is limited to authorized partners and licensees only.
>
> Redistribution, modification, or public disclosure is prohibited without express written consent.

**For licensing inquiries, please** [**contact us**](mailto:designmint@intuio.io)**.**

***

### 📥 Access & Request

DesignMint is currently offered to select partners under early access.

If you'd like to request access to the starter kit, or explore how DesignMint can power your e-commerce experience:

* 📧 **Email**: [designmint@intuio.io](mailto:designmint@intuio.io)
* 🛠️ **Integration Support**: Available upon partnership confirmation.

***

### 🔍 Under the Hood (Technical Highlights)

* Built in **React** (Frontend) and **Medusa** (Backend).
* Backend Plugin for Designer Template Management.
* Frontend Library for Embedding the Designer into product pages.
* State Management: Lightweight custom context
* Canvas Engine: Optimized for performance on web and mobile.
* Accessible Keyboard Shortcuts & ARIA Labels.
* Extensible via APIs for future workflows (approval steps, automated proofs, etc.)

***

### 📑 Related Docs

* Starter Setup Guide
* Cloud Deployment Scripts
* Admin Setup for Templates
* API References (coming soon)
* FAQs and Troubleshooting (coming soon)

***

***

## ✨ Call To Action

Love what you see? Ready to power up your e-commerce customization?

👉 **Request Access Now**: [contact@yourdomain.com](mailto:contact@yourdomain.com)

We are excited to bring you the future of Web2Print customization!
