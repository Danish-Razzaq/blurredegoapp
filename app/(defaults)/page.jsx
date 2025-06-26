import React from 'react';
import Home from './pages/home/page';
import Layout from './components/layout/Layout';
import DefaultLayout from '../(dashboard)/layout'


const Page = () => {

    return (
        <>
        <DefaultLayout />
            {/* <Layout>
                <Home />
            </Layout> */}
        </>
    );
};

export default Page;
