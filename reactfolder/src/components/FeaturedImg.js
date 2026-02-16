const FeaturedImg = ({ page, size="full", fallback }) => {

        const selectedImg = page._embedded["wp:featuredmedia"]?.[0]?.media_details?.sizes?.[size].source_url || fallback
    return (
        <>
            <img src={selectedImg} className="hero-img" />
       </>
    )
}

export default FeaturedImg;