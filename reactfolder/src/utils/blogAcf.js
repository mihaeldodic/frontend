const BASE_URL = process.env.REACT_APP_API_URL;

export const stripHtml = (html = "") =>
  String(html)
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

export const toShortText = (text = "", maxLength = 140) => {
  const plainText = stripHtml(text);

  if (!plainText) {
    return "";
  }

  if (plainText.length <= maxLength) {
    return plainText;
  }

  return `${plainText.slice(0, maxLength).trim()}...`;
};

export const getFeaturedImageUrl = (post) =>
  post?._embedded?.["wp:featuredmedia"]?.[0]?.media_details?.sizes?.full
    ?.source_url ||
  post?._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
  "";

export const resolveWpMediaUrl = async (mediaField, fallback = "") => {
  if (!mediaField) return fallback;

  if (typeof mediaField === "object") {
    return mediaField?.url || mediaField?.source_url || fallback;
  }

  if (typeof mediaField === "string" && mediaField.startsWith("http")) {
    return mediaField;
  }

  const mediaId = Number(mediaField);

  if (!mediaId) {
    return fallback;
  }

  try {
    const response = await fetch(`${BASE_URL}v2/media/${mediaId}`);

    if (!response.ok) {
      return fallback;
    }

    const media = await response.json();
    return media?.source_url || fallback;
  } catch {
    return fallback;
  }
};

export const mapBlogPostForCard = async (post) => {
  const acf = post?.acf || {};
  const featuredImage = getFeaturedImageUrl(post);

  return {
    ...post,
    _blogCardImage: (await resolveWpMediaUrl(acf.hero_slika, featuredImage)) || featuredImage,
    _blogCardExcerpt: toShortText(acf.blog_opis || post?.excerpt?.rendered || "", 140),
  };
};

export const mapBlogPostForSingle = async (post) => {
  const acf = post?.acf || {};
  const featuredImage = getFeaturedImageUrl(post);

  const sections = await Promise.all(
    [1, 2, 3].map(async (index) => {
      const title = acf[`podnaslov_${index}`] || "";
      const text = acf[`blog_opis_${index}`] || "";
      const image = await resolveWpMediaUrl(acf[`blog_slika_${index}`], "");

      if (!title && !text && !image) {
        return null;
      }

      return {
        title,
        text,
        image,
      };
    })
  );

  return {
    ...post,
    _blogHeroImage: (await resolveWpMediaUrl(acf.hero_slika, featuredImage)) || featuredImage,
    _blogIntro: acf.blog_opis || "",
    _blogConclusion: acf.blog_zakljucak || "",
    _blogSections: sections.filter(Boolean),
  };
};