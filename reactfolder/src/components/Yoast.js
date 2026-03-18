// components/Yoast.js
import React from 'react';
import { Helmet } from 'react-helmet-async';

const getCurrentPageUrl = () => {
  if (typeof window === 'undefined') {
    return '';
  }

  try {
    const currentUrl = new URL(window.location.href);
    currentUrl.hash = '';
    return currentUrl.toString();
  } catch {
    return window.location.href || '';
  }
};

const Yoast = ({ yoastHeadJson }) => {
  if (!yoastHeadJson) return null;

  const {
    title,
    description,
    robots,
    canonical,
    og_locale,
    og_type,
    og_title,
    og_description,
    og_url,
    og_site_name,
    article_published_time,
    article_modified_time,
    og_image = [],
    twitter_card,
    twitter_title,
    twitter_description,
    twitter_misc = {}
  } = yoastHeadJson;

  const primaryImage = og_image[0];
  const currentPageUrl = getCurrentPageUrl();
  const resolvedCanonical = currentPageUrl || canonical || '';
  const resolvedOgUrl = currentPageUrl || og_url || canonical || '';
  const robotsContent = robots
    ? Object.values(robots)
        .filter(Boolean)
        .join(',')
    : '';

  return (
    <Helmet>
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
      {resolvedCanonical && <link rel="canonical" href={resolvedCanonical} />}
      
      {/* Robots */}
      {robotsContent && <meta name="robots" content={robotsContent} />}
      
      {/* Open Graph */}
      {og_locale && <meta property="og:locale" content={og_locale} />}
      {og_type && <meta property="og:type" content={og_type} />}
      {og_title && <meta property="og:title" content={og_title} />}
      {og_description && <meta property="og:description" content={og_description} />}
      {resolvedOgUrl && <meta property="og:url" content={resolvedOgUrl} />}
      {og_site_name && <meta property="og:site_name" content={og_site_name} />}
      {article_published_time && <meta property="article:published_time" content={article_published_time} />}
      {article_modified_time && <meta property="article:modified_time" content={article_modified_time} />}
      {primaryImage && (
        <>
          <meta property="og:image" content={primaryImage.url} />
          <meta property="og:image:width" content={primaryImage.width} />
          <meta property="og:image:height" content={primaryImage.height} />
          <meta property="og:image:type" content={primaryImage.type} />
        </>
      )}
      
      {/* Twitter */}
      {twitter_card && <meta name="twitter:card" content={twitter_card} />}
      {twitter_title && <meta name="twitter:title" content={twitter_title} />}
      {twitter_description && <meta name="twitter:description" content={twitter_description} />}
      {resolvedOgUrl && <meta name="twitter:url" content={resolvedOgUrl} />}
      {primaryImage?.url && <meta name="twitter:image" content={primaryImage.url} />}
      {twitter_misc.Procijenjeno && <meta name="twitter:label1" content="Procijenjeno vrijeme čitanja" />}
      {twitter_misc.Procijenjeno && <meta name="twitter:data1" content={twitter_misc.Procijenjeno} />}
    </Helmet>
  );
};

export default Yoast;