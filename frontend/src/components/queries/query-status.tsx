import { UseQueryResult } from "@tanstack/react-query"
import React from "react"

interface QueryStatusProps {
  query: UseQueryResult
  children: React.ReactNode
}

export const QueryStatus: React.FC<QueryStatusProps> = ({ query, children }) => {
  if (query.status === 'error') return <>error !</>
  if (query.status === 'loading') return <>loading...</>
  if (query.status === 'success') return <>{children}</> ?? <></>
  return <></>
}