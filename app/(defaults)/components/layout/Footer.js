import Image from 'next/image';
import Link from 'next/link';

export default function Footer1({}) {
    const googleMapsUrl =
        'https://www.google.com/maps/search/?api=1&query=Unit+39%2C14%2FF%2C+Block+D%2C+Wah+Lok+Industrial+Centre%2C+No.31-35+Shan+Mei+Street%2C+Fo+Tan%2C+Shatin%2C+New+Territories%2C+Hong+Kong';
    return (
        <>
            <footer className="footer">
                <div className="footer-1 ">
                    <div className="cnt-center container">
                        <div className="row">
                            <div className="col-lg-4   mb-30">
                                <div className="mb-20">
                                    <Image src="/assets/imgs/template/logo.png" alt="Blurred Ego" width={182.62} height={80} />
                                </div>
                                <p className="font-xs my-6  pr-3 lg:w-[327px]">
                                    Connecting freight forwarders worldwide, our platform fosters networking, collaboration, and business opportunities within the logistics industry. At Blurred Ego, we
                                    understand that the modern logistics landscape demands more than just connections; it requires a dynamic, supportive, and innovative community. That's why we've
                                    created a network that empowers independent freight forwarders to thrive in an increasingly competitive market.
                                </p>
                            </div>
                            <div className="col-lg-2 col-md-3 col-sm-4 mb-30">
                                <h5 className="color-brand-1  mb-10">Quick Links</h5>
                                <ul className="menu-footer">
                                    <li>
                                        <Link href="/">Home</Link>
                                    </li>
                                    <li>
                                        <Link href="/pages/about">About Us</Link>
                                    </li>
                                    <li>
                                        <Link href="/pages/benefits">Benefits</Link>
                                    </li>
                                    <li>
                                        <Link href="/pages/events">Events</Link>
                                    </li>
                                    <li>
                                        <Link href="/pages/blogs">News</Link>
                                    </li>
                                </ul>
                            </div>
                            <div className="col-lg-2  col-md-3 col-sm-4  mb-30">
                                <h5 className="color-brand-1  mb-10">Members</h5>
                                <ul className="menu-footer">
                                    <li>
                                        <Link href="#">Profile</Link>
                                    </li>
                                    <li>
                                        <Link href="#">Search</Link>
                                    </li>
                                    <li>
                                        <Link href="/login">Login</Link>
                                    </li>
                                    <li>
                                        <Link href="/register">Join-Us</Link>
                                    </li>
                                </ul>
                            </div>
                            <div className="col-lg-2  col-md-3 col-sm-4 mb-30">
                                <h5 className="color-brand-1  mb-10">Contact Us</h5>
                                <ul className="menu-footer">
                                    <li>
                                        <Link href="mailto:Info@blurredego.com">Info@blurredego.com</Link>
                                    </li>
                                    <li>  <Link href="https://wa.me/85269327488"  target="_blank" rel="noopener noreferrer">
                                                +852 6932 7488
                                            </Link></li>
                                    <li>
                                        {' '}
                                        <Link href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
                                            Unit 39,14/F, Block D, Wah Lok Industrial Centre, No.31-35 Shan Mei Street, Fo Tan, Shatin, New Territories, Hong Kong
                                        </Link>
                                    </li>
                                </ul>
                                <div className="mt-15 ">
                                    <Link className="icon-socials icon-linkedin" href="https://www.linkedin.com/company/Blurred Egohkg" style={{ color: 'black' }} target='_blank'  />
                                    <Link className="icon-socials icon-facebook " href="https://web.facebook.com/Blurred Egohkg" style={{ color: 'black' }} />
                                    <Link className="icon-socials icon-instagram" href="https://instagram.com/Blurred Egohkg" style={{ color: 'black' }} target='_blank'  />
                                    {/* <Link className="icon-socials icon-twitter" href="https://x.com/Blurred Egohkg" style={{ color: 'black' }} /> */}
                                    <Link className="icon-socials icon-youtube" href="https://www.youtube.com/@Blurred EgoGeoCargoAlliance" style={{ color: 'black' }} target='_blank' />
                                    {/* <Link className="icon-socials icon-skype" href="#"  style={{color:'black'}}/> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="footer-2">
                    <div className="cnt-center container">
                        <div className="footer-bottom">
                            <div className="row align-items-center">
                                <div className="col-lg-6 col-md-12 text-lg-start text-center">
                                    <span className=" font-md">©Blurred Ego Official {new Date().getFullYear()}. All rights reserved.</span>
                                </div>
                                <div className="col-lg-6 col-md-12 text-lg-end text-center">
                                    <ul className="menu-bottom">
                                        <li>
                                            <Link className="font-sm " href="#">
                                                Privacy policy
                                            </Link>
                                        </li>
                                        <li>
                                            <Link className="font-sm " href="#">
                                                Cookies
                                            </Link>
                                        </li>
                                        <li>
                                            <Link className="font-sm " href="#">
                                                Terms of service
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
}
