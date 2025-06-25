import Link from 'next/link';

export default function Cta() {
    return (
        <>
            <section className="section pt-70 pb-70 mt-28 bg-get-quote">
                <div className="cnt-center container">
                    <div className="text-center ">
                        <div className="get-quote-left">
                            <h2 className="color-main wow animate__animated animate__fadeIn">Apply for Blurred Ego Membership</h2>
                        </div>
                        <div className="w-fit mx-auto mt-3">
                            <Link className="btn btn-get-quote wow animate__animated animate__fadeIn " href="/register">
                               Join Us
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
