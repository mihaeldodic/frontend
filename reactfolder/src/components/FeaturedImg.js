const FeaturedImg = ({ post, size="full", fallback }) => {

        const selectedImg = post?._embedded["wp:featuredmedia"]?.[0]?.media_details?.sizes?.[size].source_url || fallback
    return (
        <>
            <img src={selectedImg} className="hero-img" />
       </>
    )
}

export default FeaturedImg;