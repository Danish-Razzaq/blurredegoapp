import {EventSliderFirst, EventSliderSecond, EventSliderThird} from "../../components/slider/eventSlider";

export default function SliderEvent() {
    return (
        <>
            <section className="section d-block">
                <div className="box-swiper">
                    <div className="swiper-container swiper-group-1 swiper-banner-1 space-y-5">
                        <EventSliderFirst/>
                        <EventSliderSecond/>
                        <EventSliderThird/>
                    </div>
                </div>
            </section>
        </>
    )
}
