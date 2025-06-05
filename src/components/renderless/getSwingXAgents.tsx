import { getSwingXStandardUserBasicInfo } from "@/lib/swingxApis/swingxStandard.api";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setAgents } from "@/store/slices/agentSlice";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

const GetSwingXAgents: React.FC = () => {
  const loggedInUser = useAppSelector((state) => state.user.user);
  const dispatch = useAppDispatch();

  const { data: dexUserBasicInfo } = useQuery({
    queryKey: ["dexUserBasicInfo", "dex_v1"],
    queryFn: async () => {
      const res = await getSwingXStandardUserBasicInfo();

      if (res[0]?.trading_pairs?.length > 0) {
      }

      return res;
    },
    enabled: !!(loggedInUser && loggedInUser.credentials),
  });

  useEffect(() => {
    if (dexUserBasicInfo) {
      dispatch(setAgents(dexUserBasicInfo[0]));
    }
  }, [dexUserBasicInfo]);
  return <></>;
};

export default GetSwingXAgents;
