import Link from 'next/link';

export default function InfoContact() {
    return (
        <>
            <section className="section mt-55 bg-1 position-relative pt-90 pb-90 ">
                <div className="cnt-center container">
                    <div className="row">
                        <div className="col-lg-5 text-white ">
                            <span className="btn btn-tag wow animate__animated animate__fadeIn w-28 shadow-none">Get in touch</span>
                            <h3 className="mt-15 text-white  wow animate__animated animate__fadeIn mb-20">
                                Proud to Deliver
                                <br className="d-none d-lg-block" />
                                Excellence Every Time
                            </h3>
                            <p className="font-md  wow animate__animated animate__fadeIn mb-40">
                                Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit laborum — semper quis lectus nulla. Interactively transform magnetic growth
                                strategies whereas prospective "outside the box" thinking.
                            </p>
                            <div className="row">
                                <div className="col-lg-6 mb-30">
                                    <h6 className="chart-title text-white  font-md-bold wow animate__animated animate__fadeIn">Boost your sale</h6>
                                    <p className="font-xs wow animate__animated animate__fadeIn">The latest design trends meet hand-crafted templates.</p>
                                </div>
                                <div className="col-lg-6 mb-30">
                                    <h6 className="feature-title text-white  font-md-bold wow animate__animated animate__fadeIn">Introducing New Features</h6>
                                    <p className="font-xs wow animate__animated animate__fadeIn">The latest design trends meet hand-crafted templates.</p>
                                </div>
                            </div>
                            <div className="mt-20 flex">
                                <Link className="btn btn-brand-2  shadow-none  wow animate__animated animate__fadeIn mr-20" href="/contact" style={{backgroundColor:'white', color:'red', fontWeight:'bold'}}>
                                    Contact Us
                                </Link>
                                <Link className="btn btn-link-medium text-white wow animate__animated animate__fadeIn shadow-none" href="#">
                                    Learn More
                                    <svg className="icon-16 ml-5 h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="box-image-touch " />
            </section>
        </>
    );
}
