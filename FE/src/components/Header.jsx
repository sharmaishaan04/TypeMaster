import React from "react";
import { CardBody, CardContainer, CardItem } from "./ui/3d-card";

export default function ThreeDCardDemo() {
  return (
    <CardContainer className="">
      <CardBody className="relative group/card hover:shadow-2xl  hover:border hover:border-black/[0.1] w-fit h-fit rounded-xl p-6   ">
        <CardItem as="div" translateZ="100">
          <div class="">
            <span class="absolute mx-auto py-4 flex border w-fit bg-gradient-to-r blur-xl from-primarycolor to-primarycolor bg-clip-text text-6xl box-content font-extrabold text-transparent text-center select-none">
              Typemaster
            </span>

            <h1 class="relative top-0 w-fit h-auto py-4 justify-center flex bg-gradient-to-r items-center from-primarycolor to-primarycolor bg-clip-text text-6xl font-extrabold text-transparent text-center select-auto">
              Typemaster
            </h1>
          </div>
        </CardItem>
      </CardBody>
    </CardContainer>
  );
}
