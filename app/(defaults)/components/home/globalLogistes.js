import Image from 'next/image';

export default function Info() {
    return (
        <>
            <section className="section mt-85">
                <div className="cnt-center container">
                    <div className="flex flex-col items-center text-center">
                        <Image className="mb-10 " src="/assets/imgs/template/logo.png" alt="Blurred Ego" width={119.73} height={52} />
                        <p className="font-md color-grey-700 wow animate__animated animate__fadeIn">Delivering Results for Industry Leaders</p>
                        <h2 className="color-primary-main wow animate__animated animate__fadeIn mb-20 mt-3">
                            Enhancing Global Logistics and
                            <br className="d-none d-lg-block" />
                            <span> Freight Forwarding Networks</span>
                        </h2>
                    </div>
                    <div className="row mt-50">
                        <div className="col-xl-6 col-lg-6 mb-30">
                            <div className="box-images-pround">
                                <div className="box-images wow animate__animated animate__fadeIn">
                                    <img className="img-main" src="/assets/imgs/page/homepage1/img1.webp" alt="Blurred Ego" />
                                    <div className="image-2 shape-3">
                                        <Image className='w-fit h-fit wow animate__animated animate__fadeIn  ' src="/assets/imgs/page/homepage1/vector.png" alt="Blurred Ego" width={758}  height={619 }/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-6 col-lg-6 mb-30">
                            <div className="box-info-pround" style={{}}>
                                <h3 className="color-primary-main mb-15  wow animate__animated animate__fadeIn">Comprehensive Solutions Tailored for Independent Freight Forwarders</h3>
                                <p className="font-md color-grey-500 wow animate__animated animate__fadeIn">
                                    We support the logistics and freight forwarding industry by providing a comprehensive network that connects professionals worldwide. Our platform offers vital
                                    information on Rates, Tariffs, and SOPs for container movements, helping members streamline their operations. By leveraging our extensive network, industry
                                    professionals can efficiently manage their supply chains, optimize container movements, and expand their global reach. Our commitment is to foster a robust
                                    community dedicated to excellence in logistics and freight forwarding.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
