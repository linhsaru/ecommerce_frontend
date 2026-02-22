/**
 * SEO utilities for generating metadata and structured data
 */

export const seoUtils = {
  /**
   * Generate product SEO metadata
   * @param {object} product - Product data
   * @returns {object} SEO metadata object
   */
  generateProductSEO: (product) => {
    if (!product) return {};

    const title = `${product.name} - ${product.brand || 'ECommerce Store'}`;
    const description = product.description?.substring(0, 160) ||
      `Buy ${product.name} online. ${product.price ? `Price: $${product.price}` : ''} Fast shipping available.`;

    const image = product.images?.[0] || product.image || '/images/product-default.jpg';

    return {
      title,
      description,
      keywords: [
        product.name,
        product.brand,
        product.category,
        'buy online',
        'shopping',
        'ecommerce',
      ].filter(Boolean),
      image,
      type: 'product',
      url: `${window.location.origin}/products/${product.id}`,
      structuredData: seoUtils.generateProductStructuredData(product),
    };
  },

  /**
   * Generate category SEO metadata
   * @param {object} category - Category data
   * @returns {object} SEO metadata object
   */
  generateCategorySEO: (category) => {
    if (!category) return {};

    const title = `${category.name} - Shop Online | ECommerce Store`;
    const description = category.description ||
      `Browse our ${category.name} collection. Find the best products in ${category.name} with great prices and fast shipping.`;

    return {
      title,
      description,
      keywords: [
        category.name,
        'shopping',
        'online store',
        'buy online',
        category.parentCategory,
      ].filter(Boolean),
      image: category.image || '/images/category-default.jpg',
      type: 'website',
      url: `${window.location.origin}/categories/${category.slug || category.id}`,
    };
  },

  /**
   * Generate article/blog post SEO metadata
   * @param {object} article - Article data
   * @returns {object} SEO metadata object
   */
  generateArticleSEO: (article) => {
    if (!article) return {};

    const title = `${article.title} | ECommerce Blog`;
    const description = article.excerpt || article.content?.substring(0, 160) ||
      'Read our latest articles and stay updated with the best tips and trends.';

    return {
      title,
      description,
      keywords: article.tags || [],
      image: article.featuredImage || '/images/blog-default.jpg',
      type: 'article',
      url: `${window.location.origin}/blog/${article.slug || article.id}`,
      author: article.author,
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      section: article.category,
      tags: article.tags,
      structuredData: seoUtils.generateArticleStructuredData(article),
    };
  },

  /**
   * Generate product structured data (JSON-LD)
   * @param {object} product - Product data
   * @returns {object} Structured data object
   */
  generateProductStructuredData: (product) => {
    if (!product) return null;

    return {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": product.name,
      "description": product.description,
      "image": product.images || [product.image],
      "sku": product.sku,
      "brand": {
        "@type": "Brand",
        "name": product.brand,
      },
      "offers": {
        "@type": "Offer",
        "price": product.price,
        "priceCurrency": product.currency || "USD",
        "availability": product.inStock ?
          "https://schema.org/InStock" :
          "https://schema.org/OutOfStock",
        "seller": {
          "@type": "Organization",
          "name": "ECommerce Store",
        },
      },
      "aggregateRating": product.rating ? {
        "@type": "AggregateRating",
        "ratingValue": product.rating.average,
        "reviewCount": product.rating.count,
      } : undefined,
    };
  },

  /**
   * Generate article structured data (JSON-LD)
   * @param {object} article - Article data
   * @returns {object} Structured data object
   */
  generateArticleStructuredData: (article) => {
    if (!article) return null;

    return {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": article.title,
      "description": article.excerpt || article.description,
      "image": article.featuredImage,
      "url": `${window.location.origin}/blog/${article.slug || article.id}`,
      "datePublished": article.publishedAt,
      "dateModified": article.updatedAt,
      "author": {
        "@type": "Person",
        "name": article.author?.name || article.author,
      },
      "publisher": {
        "@type": "Organization",
        "name": "ECommerce Store",
        "logo": {
          "@type": "ImageObject",
          "url": `${window.location.origin}/images/logo.png`,
        },
      },
    };
  },

  /**
   * Generate organization structured data
   * @returns {object} Organization structured data
   */
  generateOrganizationStructuredData: () => {
    return {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "ECommerce Store",
      "url": window.location.origin,
      "logo": `${window.location.origin}/images/logo.png`,
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+1-555-123-4567",
        "contactType": "customer service",
      },
      "sameAs": [
        "https://facebook.com/ecommerce-store",
        "https://twitter.com/ecommerce_store",
        "https://instagram.com/ecommerce_store",
      ],
    };
  },

  /**
   * Generate breadcrumb structured data
   * @param {array} breadcrumbs - Array of breadcrumb items
   * @returns {object} Breadcrumb structured data
   */
  generateBreadcrumbStructuredData: (breadcrumbs) => {
    if (!breadcrumbs || !Array.isArray(breadcrumbs)) return null;

    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbs.map((crumb, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": crumb.name,
        "item": `${window.location.origin}${crumb.url}`,
      })),
    };
  },

  /**
   * Generate search action structured data for Google
   * @returns {object} Search action structured data
   */
  generateSearchActionStructuredData: () => {
    return {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "ECommerce Store",
      "url": window.location.origin,
      "potentialAction": {
        "@type": "SearchAction",
        "target": `${window.location.origin}/search?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    };
  },

  /**
   * Generate FAQ structured data
   * @param {array} faqs - Array of FAQ objects
   * @returns {object} FAQ structured data
   */
  generateFAQStructuredData: (faqs) => {
    if (!faqs || !Array.isArray(faqs)) return null;

    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer,
        },
      })),
    };
  },

  /**
   * Sanitize meta description
   * @param {string} description - Description to sanitize
   * @param {number} maxLength - Maximum length
   * @returns {string} Sanitized description
   */
  sanitizeMetaDescription: (description, maxLength = 160) => {
    if (!description) return '';

    // Remove HTML tags
    const withoutHtml = description.replace(/<[^>]*>/g, '');

    // Trim whitespace
    const trimmed = withoutHtml.trim();

    // Truncate if too long
    if (trimmed.length <= maxLength) return trimmed;

    // Find last complete word within limit
    const truncated = trimmed.substring(0, maxLength);
    const lastSpaceIndex = truncated.lastIndexOf(' ');

    return lastSpaceIndex > 0
      ? truncated.substring(0, lastSpaceIndex)
      : truncated;
  },

  /**
   * Generate URL slug from title
   * @param {string} title - Title to convert
   * @returns {string} URL slug
   */
  generateSlug: (title) => {
    if (!title) return '';

    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
  },

  /**
   * Check if URL is valid for SEO
   * @param {string} url - URL to check
   * @returns {boolean} True if URL is SEO-friendly
   */
  isSEOFriendlyUrl: (url) => {
    if (!url) return false;

    // Should be lowercase
    if (url !== url.toLowerCase()) return false;

    // Should not have spaces
    if (url.includes(' ')) return false;

    // Should use hyphens instead of underscores
    if (url.includes('_')) return false;

    // Should not be too long
    if (url.length > 100) return false;

    return true;
  },
};
