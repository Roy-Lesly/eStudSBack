import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import initTranslations from "@/initTranslations";
import BackGround from "../pageAuthentication/BackGround";
import { gql } from "@apollo/client";
import { queryServerGraphQL } from "@/utils/graphql/queryServerGraphQL";
import ModalSelectSection from "./ModalSelectSection";

const page = async (
  { params, searchParams }: { params: any, searchParams: any }
) => {

  const { locale, domain } = await params;
  const sp = await searchParams;

  const { t } = await initTranslations(locale, ["common"]);

  const data = await queryServerGraphQL({
    domain,
    query: GET_DATA,
  });

  const d = data?.allSchoolIdentifications?.edges[0]
  const conditions = [d?.node?.hasHigher, d?.node?.hasSecondary, d?.node?.hasPrimary, d?.node?.hasVocational]
  const trueCount = conditions.filter(Boolean).length;

  let activeSection: string | null = null;

  if (trueCount === 1) {
    if (d?.node?.hasHigher) {
      activeSection = "higher";
    } else if (d?.node?.hasSecondary) {
      activeSection = "secondary";
    } else if (d?.node?.hasPrimary) {
      activeSection = "primary";
    } else if (d?.node?.hasVocational) {
      activeSection = "vocational";
    }
  }

  console.log(activeSection);
  console.log(trueCount);

  return (
    <BackGround
      width="w-full md:w-[80%]"
    >
      {/* <main className="flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-800 text-white px-2 md:px-6 p-4 md:py-10"> */}
      {(trueCount < 2 || sp?.hide === "true") ? <main className="flex flex-col items-center justify-center bg-gradient-to-br  text-white px-2 md:px-6 p-4 md:py-10">

        {/* Welcome Section */}
        <section className="text-center max-w-3xl">
          <h1 className="text-2xl md:text-4xl font-bold mb-4">{t("Welcome to the Pre-Enrollment Portal")}</h1>
          <p className="text-lg opacity-90">
            {t("Start your journey with us! This portal is designed to guide you through the **pre-enrollment** process smoothly. Follow the simple steps below to secure your place in our institution")}.
          </p>
        </section>

        {/* Instructions Section */}
        <section className="bg-white text-gray-900 shadow-lg rounded-lg p-2 md:p-6 mt-4 md:mt-8 max-w-2xl text-black">
          <h2 className="text-lg md:text-2xl font-bold text-center mb-4">{t("How to Get Started")}</h2>
          <ul className="list-disc pl-6 space-y-2 md:text-lg md:gap-2">
            <li>📌 {t("Click On")}<strong> {t("Begin Enrollment")}</strong> {t("to begin your application")}.</li>
            <li>📌 {t("Fill out the required details and submit your information")}.</li>
            <li>📌 {t("Check your application status anytime using the **Check** option")}.</li>
            <li>📌 {t("Make sure your details are correct before submission")}.</li>
          </ul>
        </section>

        {/* CTA Buttons */}
        <div className="mt-6 flex gap-4">
          <Link
            href="/pre-inscription/Check"
            className="bg-blue-500 text-white font-semibold px-2 md:px-5 py-2 md:py-3 rounded-lg shadow-md hover:bg-blue-400 transition-all"
          >
            {t("Check Status")} 📑
          </Link>
          <Link
            href={`/pre-inscription/New/${ trueCount === 1 ? activeSection : sp?.section || "higher"}`}
            className="bg-white text-blue-700 font-semibold px-2 md:px-5 py-2 md:py-3 rounded-lg shadow-md hover:bg-gray-100 transition-all"
          >
            {t("Begin Enrollment")} 🚀
          </Link>
        </div>
      </main>

        :

        <ModalSelectSection
          params={{ locale, domain }}
          sp={sp}
          data={d}
          trueCount={trueCount}
        />
      }


    </BackGround>
  );
};

export default page;

export const metadata: Metadata = {
  title: "Pre-Enrollment Portal",
  description: "Begin your journey with our school system by pre-enrolling today!",
};


const GET_DATA = gql`
  query GetInfo {
    allSchoolIdentifications (
      last: 2
    ) {
      edges {
        node {
          id name version messageOne messageTwo logo supportNumberOne hasHigher hasSecondary hasPrimary
        }
      }
    }
  }
`;