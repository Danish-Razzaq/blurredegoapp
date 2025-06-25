import Testimonial1Slider from '../slider/ServicesSliderCard';

export default function Testimonial() {
    return (
        <>
            <section className="section mt-50 bg-customers-say">
                <div className="cnt-center container">
                    <h2 className="title-favicon color-white title-padding-left wow animate__animated animate__fadeIn mb-20">What our Members are saying</h2>
                    <p className="font-lg color-white  wow animate__animated animate__fadeIn">
                        Discover how Blurred Ego's support and global network have empowered independent freight forwarders.
                        <br className="d-none d-lg-block" />
                        <span> Read testimonials about the positive impact on their businesses.</span>{' '}
                    </p>
                </div>
                <div className="cnt-center container">
                    <div className=" mt-50">
                        <div className="">
                            <div className=" pb-50">
                                <Testimonial1Slider />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
