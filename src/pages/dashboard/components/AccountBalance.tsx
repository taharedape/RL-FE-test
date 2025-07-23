import { useEffect, useState } from "react"
import { useGetUserBalanceQuery } from "@/store/api/walletAPI.ts"
import CurrencyFlagImage from "react-currency-flags/dist/components"
import { useNavigate } from "react-router"
import { useDispatch } from "react-redux"
import { setDepositInitial } from "@/store/slice/transaction/transactionSlice.ts"
import { PiArrowRight } from "react-icons/pi"
import { Utilities } from "@/lib/Utilities"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import CurrencyFlags from "@/components/common/CurrencyFlags"
import FormatNumberView from "@/components/common/FormatNumberView"

export default function AccountBalance() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { data, isLoading } = useGetUserBalanceQuery()
  const [overallBalance, setOverallBalance] = useState<number>(0)

  const handleClick = (to: string) => {
    dispatch(setDepositInitial())
    navigate(to)
  }

  useEffect(() => {
    setOverallBalance(data?.overallBalance || 0)
  }, [data])

  return (
    <>
      <div className="flex flex-col items-center p-6 rounded-3xl lg:border border-neutral-200">
        <div className="flex items-center justify-between w-full mb-4">
          <div className="bodyL text-black sm:hidden">Account Balance</div>
          <div className="h4 text-black hidden sm:block">Account Balance</div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleClick("/dashboard/deposit")}
            >
              Deposit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleClick("/exchange")}
            >
              Exchange
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleClick("/send-money")}
            >
              Send Money
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-between w-full md:mt-12">
          <div className="bodySB text-[#a5a7a6] hidden sm:block">
            Overall (in USD)
          </div>
          {overallBalance ? (
            <div className="h5 text-neutral-900">
              {Utilities.separateCurrency(overallBalance)} $
            </div>
          ) : (
            <Skeleton className="w-1/4 h-10" />
          )}
        </div>
        <hr className="border border-[#dee0e0] w-full my-6" />
        <div className="flex flex-col w-full gap-4">
          {isLoading ? (
            <div className="flex flex-col gap-4">
              <div className="flex justify-between">
                <Skeleton className="w-20 h-8" />
                <Skeleton className="w-20 h-8" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="w-20 h-8" />
                <Skeleton className="w-20 h-8" />
              </div>
            </div>
          ) : data?.walletBalanceItems?.length ? (
            (data?.walletBalanceItems?.length <= 3
              ? data?.walletBalanceItems || []
              : data?.walletBalanceItems?.slice(0, 3) || []
            ).map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="bodyS flex items-center gap-3">
                  <CurrencyFlags
                    size={24}
                    type={
                      item.currency.includes("USDT") ||
                      item.currency.includes("USDC")
                        ? "STABLE_COIN"
                        : ""
                    }
                    currency={item.currency}
                  />
                  <div className="flex flex-col">
                    <span className="flex items-center bodyS font-semibold text-[#141414]">
                      {item.currency}
                      <Button
                        variant="link"
                        size="sm"
                        className="p-0 pl-2"
                        onClick={() =>
                          handleClick(`/wallet?currency=${item.currency}`)
                        }
                      >
                        See Details
                      </Button>
                    </span>
                    <span className="captionS leading-normal text-[#a5a7a6]">
                      {Utilities.getCurrencyName(item.currency)}
                    </span>
                  </div>
                </div>
                <div className="bodySB font-semibold text-[#141414]">
                  {item.type == "DR" ? " - " : " + "}
                  <FormatNumberView
                    currency={item.currency}
                    value={item.balance}
                  />
                </div>
              </div>
            ))
          ) : (
            <>
              <div className="flex items-center justify-between">
                <div className="bodyS flex items-center gap-2 text-[#a5a7a6]">
                  <CurrencyFlagImage
                    width={24}
                    height={24}
                    currency={"USD"}
                    className="rounded-full"
                  />
                  <div className="flex flex-col">
                    <span className="bodyS font-semibold text-[#141414]">
                      USD
                    </span>
                    <span className="captionS leading-normal text-[#a5a7a6]">
                      {Utilities.getCurrencyName("USD")}
                    </span>
                  </div>
                </div>
                <div className="bodyS text-[#a5a7a6]">0</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="bodyS flex items-center gap-2 text-[#a5a7a6]">
                  <CurrencyFlagImage
                    width={24}
                    height={24}
                    currency={"EUR"}
                    className="rounded-full"
                  />
                  <div className="flex flex-col">
                    <span className="bodyS font-semibold text-[#141414]">
                      EUR
                    </span>
                    <span className="captionS leading-normal text-[#a5a7a6]">
                      {Utilities.getCurrencyName("EUR")}
                    </span>
                  </div>
                </div>
                <div className="bodyS text-[#a5a7a6]">0</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="bodyS flex items-center gap-2 text-[#a5a7a6]">
                  <CurrencyFlagImage
                    width={24}
                    height={24}
                    currency={"CAD"}
                    className="rounded-full"
                  />
                  <div className="flex flex-col">
                    <span className="bodyS font-semibold text-[#141414]">
                      CAD
                    </span>
                    <span className="captionS leading-normal text-[#a5a7a6]">
                      {Utilities.getCurrencyName("CAD")}
                    </span>
                  </div>
                </div>
                <div className="bodyS text-[#a5a7a6]">0</div>
              </div>
            </>
          )}
        </div>
        {data?.walletBalanceItems?.[3] && (
          <div className="flex w-full items-center justify-center -mb-4">
            <Button
              variant="ghost"
              className="py-2"
              onClick={() => handleClick("/wallet")}
            >
              Show More
              <PiArrowRight size={20} className="ml-2" />
            </Button>
          </div>
        )}
      </div>
    </>
  )
}
