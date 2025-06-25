import News1Slider from '../slider/NewsSlider';

export default function News() {
    return (
        <>
            <section className="section mt-110 bg-choose-plan-left">
                <div className="cnt-center container   ">
                    <div className="row align-items-center">
                        <div className="col-lg-8 col-md-8">
                            <h2 className="title-favicon wow animate__animated animate__fadeIn0 mb-2">Latest News</h2>
                            <p className="font-md color-grey-700 wow animate__animated animate__fadeIn">
                                Stay updated with the latest developments, industry insights, and success stories from our <br className="d-none d-lg-block " />
                                <span> global network of freight forwarders.</span>{' '}
                            </p>
                        </div>
                        <div className="col-lg-4 col-md-4 text-end">
                            <div className="box-button-sliders box-pagination-customers flex w-36 gap-4 max-sm:hidden">
                                <div className="box-pagination-customers flex w-36 gap-3 max-sm:hidden ">
                                    <div className="swiper-button-prev-customers swiper-button-prev-style-1  wow animate__animated animate__fadeIn">
                                        <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                                        </svg>
                                    </div>
                                    <div className="swiper-button-next-customers  swiper-button-next-style-1 wow animate__animated animate__fadeIn" style={{ backgroundColor: 'red' }}>
                                        <svg fill="none" stroke="white" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row mt-60">
                        <div className="box-swiper">
                            <div className="swiper-container swiper-group-3-customers pb-50">
                                <News1Slider />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
