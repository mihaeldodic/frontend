// components/Yoast.js
import React from 'react';
import { Helmet } from 'react-helmet-async';

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
    article_modified_time,
    og_image = [],
    twitter_card,
    twitter_misc = {}
  } = yoastHeadJson;

  const primaryImage = og_image[0];

  // Robots direktno kao name/content
  const robotTags = [];
  if (robots) {
    Object.entries(robots).forEach(([key, value]) => {
      if (value) robotTags.push(<meta key={`robots-${key}`} name={`robots-${key}`} content={value} />);
    });
  }

  return (
    <Helmet>
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
      <link rel="canonical" href={canonical} />
      
      {/* Robots */}
      {robotTags}
      
      {/* Open Graph */}
      {og_locale && <meta property="og:locale" content={og_locale} />}
      {og_type && <meta property="og:type" content={og_type} />}
      {og_title && <meta property="og:title" content={og_title} />}
      {og_description && <meta property="og:description" content={og_description} />}
      {og_url && <meta property="og:url" content={og_url} />}
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
      {twitter_misc.Procijenjeno && <meta name="twitter:label1" content="Procijenjeno vrijeme čitanja" />}
      {twitter_misc.Procijenjeno && <meta name="twitter:data1" content={twitter_misc.Procijenjeno} />}
    </Helmet>
  );
};

export default Yoast;