import React from "react"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import InputCash from "@/components/common/input-cash"

const DepositModal: React.FC = () => {
  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <div className="text-[#564100] text-[21px] font-semibold font-['Inter'] underline capitalize leading-normal cursor-pointer">
            Deposit
          </div>
        </DialogTrigger>
        <DialogContent className="grid grid-cols-2 w-full max-w-3xl  h-auto  ">
          <div className="flex justify-center items-center flex-col w-full p-10 col-span-2 md:col-span-1">
            <div className="title flex flex-col gap-4 ">
              <div className="text-[#141414] text-3xl font-semibold leading-tight">Deposit</div>
              <div className="text-[#141414] text-base font-normal leading-[21px]">
                Create an add money request to increase your account balance.
              </div>
            </div>
            <div className="w-full mt-6">
              <InputCash />
            </div>
            <div className="flex justify-between items-center w-full my-4 ">
              <div className="text-[#a5a7a6] text-xs font-normal font-['Inter'] leading-none">Fees</div>
              <div className="text-[#a5a7a6] text-xs font-normal font-['Inter'] leading-none">0 $</div>
            </div>
            <div className="h-[0px] border border-[#dee0e0] w-full mb-4"></div>
            <div className="flex justify-between items-center w-full">
              <div className="text-[#141414] text-base font-bold font-['Inter'] leading-[21px]">
                Amount you will receive
              </div>
              <div>
                <span className="text-[#141414] text-base font-bold font-['Inter'] leading-[21px]">1,879.</span>
                <span className="text-[#141414] text-xs font-normal font-['Inter'] leading-none">44</span>
                <span className="text-[#141414] text-base font-bold font-['Inter'] leading-[21px]"> AED</span>
              </div>
            </div>
            <div className="h-12 px-7 py-3.5 bg-[#00261d] rounded-[100px] justify-center items-center gap-1 inline-flex mt-6 w-full">
              <div className="text-white text-base font-semibold font-['Inter'] capitalize leading-tight">
                Create request
              </div>
            </div>
          </div>
          <div className="w-full col-span-2 md:col-span-1 ">
            <img className="" src="../../../../public/app/Frame 119.png" />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default DepositModal
