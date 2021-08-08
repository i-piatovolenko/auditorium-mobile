import {Mode, OccupiedInfo, OccupiedState, User} from "../models/models";
import React, {useEffect, useRef, useState} from "react";
import {useQuery} from "@apollo/client";
import {GET_ME} from "../api/operations/queries/me";
import {useLocal} from "./useLocal";
import {getTimeFromUntil, isPendingForMe} from "../helpers/helpers";

const useTimeLeft = (occupied: OccupiedInfo, minutesDuration: number) => {
  const [timeLeft, setTimeLeft] = useState('');
  const [timeLeftInPer, setTimeLeftInPer] = useState(100);
  const interval = useRef<any>({current: null});
  const {data: {me}} = useQuery(GET_ME);
  const {data: {mode}} = useLocal('mode');

  useEffect(() => {
    if (occupied && occupied.user.id === me.id  && interval.current !== null) {
      // @ts-ignore
      interval.current = setInterval(() => {
        // @ts-ignore
        const [left, leftPer] = getTimeFromUntil(occupied?.until as unknown as string, minutesDuration);
        const min: string = (left as string).split(':')?.[0] + ' хв. ';
        const sec: string = (left as string).split(':')?.[1] + ' сек. ';

        setTimeLeft(min + sec);
        setTimeLeftInPer(leftPer as number);
        if (timeLeftInPer <= 0) clearInterval(interval.current);
      }, 1000);
    } else {
      clearInterval(interval.current);
      interval.current = null;
      setTimeLeft('');
    }
  }, [occupied?.state]);

  return [timeLeft, timeLeftInPer];
};

export default useTimeLeft;