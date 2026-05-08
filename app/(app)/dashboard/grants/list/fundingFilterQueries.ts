"use client";

import {
  FundingActionWithCalls,
  FundingAgencyWithProgrammesActionsCallsAndGrants,
  FundingProgrammeWithActionsCalls,
} from "@/prisma/customTypes";
import { FundingCall } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

const fetchFundingAgencies = async () => {
  const res = await fetch("/api/fundingAgencies", {
    next: { tags: ["fundingAgencies-api"] },
  });
  return res.json();
};

const fetchFundingProgrammes = async () => {
  const res = await fetch("/api/fundingProgrammes", {
    next: { tags: ["fundingProgrammes-api"] },
  });
  return res.json();
};

const fetchFundingActions = async () => {
  const res = await fetch("/api/fundingActions", {
    next: { tags: ["fundingActions-api"] },
  });
  return res.json();
};

const fetchFundingCalls = async () => {
  const res = await fetch("/api/fundingCalls", {
    next: { tags: ["fundingCalls-api"] },
  });
  return res.json();
};

export const useFundingFilterAgencies = () =>
  useQuery<FundingAgencyWithProgrammesActionsCallsAndGrants[]>({
    queryKey: ["fundingAgencies-api"],
    queryFn: fetchFundingAgencies,
    staleTime: 60 * 1000,
    retry: 3,
    cacheTime: 0,
  });

export const useFundingFilterProgrammes = () =>
  useQuery<FundingProgrammeWithActionsCalls[]>({
    queryKey: ["fundingProgrammes-api"],
    queryFn: fetchFundingProgrammes,
    staleTime: 60 * 1000,
    retry: 3,
    cacheTime: 0,
  });

export const useFundingFilterActions = () =>
  useQuery<FundingActionWithCalls[]>({
    queryKey: ["fundingActions-api"],
    queryFn: fetchFundingActions,
    staleTime: 60 * 1000,
    retry: 3,
    cacheTime: 0,
  });

export const useFundingFilterCalls = () =>
  useQuery<FundingCall[]>({
    queryKey: ["fundingCalls-api"],
    queryFn: fetchFundingCalls,
    staleTime: 60 * 1000,
    retry: 3,
    cacheTime: 0,
  });
