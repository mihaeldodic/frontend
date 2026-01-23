import "./Blog.css"
import post from "../components/zadaci/data/blogsingle.json";
        
        
const BlogSingle = (post) => {
    return (
    
    <div className="blog-single">
        <div class="masthead" style={{
            backgroundImage: "url("+post._embedded['wp:featuredmedia'][0].media_details.sizes.full.source_url+")"
        }}>
            <div class="container position-relative px-4 px-lg-5">
                <div class="row gx-4 gx-lg-5 justify-content-center">
                    <div class="col-md-10 col-lg-8 col-xl-7">
                        <div class="post-heading">
                            <h1>Mladena Grdovića policija je uhitila s 3,6 promila alkohola u krvi za volanom</h1>
                            <h2 class="subheading">Bez dlake na jeziku</h2>
                            <span class="meta">
                                Autor:
                                <a href="#!">Zvonimir Milaković</a>
                                , 15. prosinca, 2025
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>


        <article class="mb-4">
            <div class="container px-4 px-lg-5">
                <div class="row gx-4 gx-lg-5 justify-content-center">
                    <div class="col-md-10 col-lg-8 col-xl-7">
                        <p><strong>"Ne žalim zbog toga. Tu su postojale izdajice, oni ljubomorni, jer sam uvijek vozio dobar auto. Onaj koga si častio, taj te prvi izdao", kazao je Grdović u emisiji.</strong></p>

                        <p><a href="https://www.vecernji.hr/tag/mladen-grdovic-3879" target="_blank"><strong>Mladen Grdović</strong></a>, legenda hrvatske zabavne glazbe, nedavno je gostovao u našoj emisiji "<a href="https://www.youtube.com/watch?v=6Ys_NniqIjE&amp;list=PLwkAZA40UDUIMAAs0RT11eQJE2WRkGLUF&amp;index=2" rel="nofollow" target="_blank"><strong>Show na kvadrat</strong></a>", a gdje je govorio o mnogim zanimljivostima iz privatnog života. Ono što svakako nije moglo proći "ispod radara" jest upravo njegova prošlogodišnja vožnja za Dan zaljubljenih, odnosno 14. veljače. Tada ga je <strong>policija uhitila</strong> u alkoholiziranom stanju, a&nbsp;alkotestom je napuhao čak <strong>3,6 promila</strong> alkohola u krvi. Mediji su tada prenosili kako je njegov slučaj završio na oglasnoj ploči zadarskog Općinskog suda, a zbog ovog slučaja trajno mu je oduzeta vozačka dozvola. "Ne žalim zbog toga. Tu su postojale <strong>izdajice, oni ljubomorni, </strong>jer sam&nbsp;uvijek vozio dobar&nbsp;auto. Onaj koga si častio, taj te prvi izdao", kazao nam je Grdović u emisiji. "Inače, nikada ni jedan automobil nisam oštetio. Od tri milijuna kilometara imam samo četiri sudara. Meni su, iskreno, opasniji ovi električni romobili", dodao je Mladen te nam odgovorio na pitanje jesu li mu policajci opraštali kazne tijekom života, s obzirom na to da je jedan od najpopularnijih dalmatinskih glazbenika. "Nisu mi ništa opraštali, više sam platio kazni nego što imam nastupa", priznao je, a o drugom dijelu ove teme&nbsp;kojom želimo podići svijest u&nbsp;društvu da se nikako ne smije sjedati pod utjecajem alkohola za volan&nbsp;te da vozači trebaju biti izuzetno pažljivi i oprezni –&nbsp;doznajte u našoj emisiji ispod teksta. U razgovoru se prisjetio i njegova slavnog <strong>Ferrarija </strong>zbog kojeg je bio itekako popularan u medijima...</p>
                        <p><div class="responsive-iframe embeded_youtube"><iframe allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen="" frameborder="0" height="480" referrerpolicy="strict-origin-when-cross-origin" src="https://www.youtube.com/embed/6Ys_NniqIjE?list=PLwkAZA40UDUIMAAs0RT11eQJE2WRkGLUF&amp;enablejsapi=1&amp;origin=https%3A%2F%2Fwww.vecernji.hr" title="Mladen Grdović: Majku svoje kćeri ne želim vidjeti, ništa mi nije značila, a Brankica je povijest" class="responsive-iframe__content adexElement adexFoundElement-0" data-gtm-yt-inspected-6866024_16="true" id="941001141" data-gtm-yt-inspected-11="true"></iframe></div></p>
                        <p>Podsjetimo, glazbenik je gostovao u našoj emisiji zbog iznimnog jubileja –&nbsp;<strong>45 godina karijere. </strong>Tom prilikom podijelio je s publikom detalje iz svog privatnog života, ali i brojne zanimljivosti koje dosad nisu bile poznate široj javnosti. Emisija je bila prilika da se prisjeti svojih najvažnijih trenutaka, kako onih profesionalnih&nbsp;tako i osobnih. Povod za intervju u emisiji bio je <strong>nadolazeći doček Nove godine u Sisku</strong>, kojem se Mladen izuzetno veseli. Svi koji ga poznaju svjesni su njegove strasti prema glazbi i nepresušnom entuzijazmu prema živim nastupima, a Grdović je najavio da će to biti fešta za pamćenje, puna&nbsp;emocija i zagarantirane zabave. Osim toga, 8. veljače slavi 45 godina karijere velikim koncertima u prestižnoj dvorani Vatroslava Lisinskog, na kojima će, kako sam kaže, osjetiti posebnu povezanost s publikom, koja mu je kroz godine bila vjetar u leđa. Ta prilika za proslavu velikog jubileja&nbsp;za njega je više od običnog nastupa – to je, kako ističe, prilika za ponovno okupljanje, za slavlje zajedničkog puta koji je podijelio s obožavateljima i prijateljima.</p>
                    </div>
                </div>
            </div>
        </article>
    </div>
    );
}

export default BlogSingle;