import Image from "next/image";
import Accordion from "../elements/Accordion";
import Link from "next/link";

export default function Faqs() {
  return (
    <>
      <section className="section pt-80 mb-70 bg-faqs">
        <div className="container cnt-center">
          <div className="row">
            <div className="col-lg-6">
              <div className="box-faqs-left">
                <h2 className="title-favicon color-primary-main  mb-20 wow animate__animated animate__fadeIn">
                  FAQs
                </h2>
                <p className="font-md color-grey-700 mb-50 wow animate__animated animate__fadeIn">
                Feeling inquisitive? Have a read through some of our FAQs or contact our
                <br className="d-none d-lg-block"/ ><span> supporters for help</span>
               
                </p>
                <div className="box-gallery-faqs">
                  <div className="image-top wow animate__animated animate__fadeIn">
                    <Image
                    className="w-fit h-fit"
                      src="/assets/imgs/page/homepage1/img-faq1.webp"
                      alt="Blurred Ego FAQs"
                      width={657}
                      height={330}
                    />
                  </div>
                  <div className="image-bottom wow animate__animated animate__fadeIn">
                    <div className="image-faq-1">
                      <Image
                      className="w-fit h-fit"
                        src="/assets/imgs/page/homepage1/img-faq2.webp"
                        alt="Blurred Ego FAQs"
                        width={457}
                        height={348}
                      />
                    </div>
                    <div className="image-faq-2 wow animate__animated animate__fadeIn">
                      <Image
                      className="w-fit h-fit"
                        src="/assets/imgs/page/homepage1/img-faq3.webp"
                        alt="Blurred Ego FAQs"
                        width={336}
                        height={343}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="box-accordion">
                <Accordion />
                <div className="line-border mt-50 mb-50" />
                <h3 className="color-primary-main wow animate__animated animate__fadeIn">
                  Need more help?
                </h3>
                <div className="mt-20 flex ">
                  <Link
                    className="btn btn-brand-1-big mr-20 wow animate__animated animate__fadeIn"
                    href="/pages/contact"
                  >
                    Contact Us
                  </Link>
                  <Link
                    className="btn  btn-link-medium wow animate__animated animate__fadeIn"
                    href="/pages/about"
                  >
                    Learn More
                    <svg
                      className="w-6 h-6 icon-16 ml-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
