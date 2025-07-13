import Head from "next/head";
import React, {useState} from "react";
import Offer from "../../../components/sub/Offer";
import Navbar from "../../../components/common/Navbar";
import BreadCrumb from "../../../components/BreadCrumb";
import Program from "../../../components/Program";
import Footer from "../../../components/common/Footer";
import Modal from "react-modal";
import { GET_MULTI_DAY_TRIP_BYID, GET_TRIP_BY_ID } from "../../../graphql/queries";
import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";

export async function getServerSideProps({params}) {
  const {program_id} = params;
  // fetch data for the post with ID equal to 'post'
  return {props: {type: program_id}};
}
const ProgramPage = ({ type }) => {
  const router = useRouter();
  const { program_id } = router.query;

  // ALWAYS declare hooks first
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const { loading, error, data } = useQuery(GET_TRIP_BY_ID, {
    variables: { id: program_id },
    skip: !program_id,
  });

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) return <p>Error loading program.</p>;


  const breadcrumbs = [
    {name: "الصفحة الرئيسية", path: "/"},
    {
      name: "البرامج السياحية",
      path: "/travels-programs?type=programs",
    },
    {name: "الشمال التركي", path: "/travels-programs/program"},
  ];
  return (
    
    <div className="">
      <Head>
        <title>Arrivo | Program Title</title>
        <meta
          name="description"
          content="This is a beautiful travel agency website"
        />
      </Head>

      <main>
        <div className="hidden md:block">
          <Offer />
        </div>
        <Navbar />
        <div className="mt-[30px] md:mt-[50px]">
          <BreadCrumb breadcrumbs={breadcrumbs} />
        </div>
        <Program
        trip={data?.trip}
          type={type}
          openModal={openModal}
          modalIsOpen={modalIsOpen}
          closeModal={closeModal}
        />
        {/* <SimilarOffers /> */}
      </main>

      <footer className="">
        <Footer />
      </footer>
    </div>
  );
};

export default ProgramPage;
