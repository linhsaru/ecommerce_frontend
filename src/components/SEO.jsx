import { Helmet } from 'react-helmet-async';

/**
 * SEO component for managing page metadata
 */
const SEO = ({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  siteName = 'ECommerce Store',
  author,
  publishedTime,
  modifiedTime,
  section,
  tags,
  noindex = false,
  nofollow = false,
  canonical,
}) => {
  // Default meta values
  const defaultTitle = 'ECommerce Store - Best Products Online';
  const defaultDescription = 'Shop the best products online with fast shipping and great prices. Discover amazing deals on electronics, fashion, home goods and more.';

  const metaTitle = title || defaultTitle;
  const metaDescription = description || defaultDescription;
  const metaImage = image || '/images/og-default.jpg';
  const metaUrl = url || window.location.href;
  const metaKeywords = keywords ? (Array.isArray(keywords) ? keywords.join(', ') : keywords) : '';

  return (
    <Helmet>
      {/* Basic meta tags */}
      <title>{metaTitle}</title>
      <meta name="description" content={metaDescription} />
      {metaKeywords && <meta name="keywords" content={metaKeywords} />}
      {author && <meta name="author" content={author} />}
      {section && <meta name="section" content={section} />}

      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={canonical} />}

      {/* Robots meta */}
      {(noindex || nofollow) && (
        <meta
          name="robots"
          content={`${noindex ? 'noindex' : 'index'},${nofollow ? 'nofollow' : 'follow'}`}
        />
      )}

      {/* Open Graph meta tags */}
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:url" content={metaUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteName} />

      {/* Twitter Card meta tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={metaImage} />

      {/* Article specific meta tags */}
      {type === 'article' && (
        <>
          {publishedTime && <meta property="article:published_time" content={publishedTime} />}
          {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
          {author && <meta property="article:author" content={author} />}
          {section && <meta property="article:section" content={section} />}
          {tags && Array.isArray(tags) && tags.map(tag => (
            <meta key={tag} property="article:tag" content={tag} />
          ))}
        </>
      )}

      {/* Product specific meta tags */}
      {type === 'product' && (
        <>
          {/* Add product-specific Open Graph tags if needed */}
        </>
      )}

      {/* Additional structured data */}
      {type === 'product' && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": title,
            "description": metaDescription,
            "image": metaImage,
            "url": metaUrl,
          })}
        </script>
      )}

      {type === 'article' && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": title,
            "description": metaDescription,
            "image": metaImage,
            "url": metaUrl,
            "datePublished": publishedTime,
            "dateModified": modifiedTime,
            "author": {
              "@type": "Person",
              "name": author,
            },
          })}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
