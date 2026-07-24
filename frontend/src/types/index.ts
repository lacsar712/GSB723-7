export interface MarketSourceItem {
  id: string
  name: string
  source_type: string
  status: 'online' | 'offline' | 'error'
  description?: string
  is_enabled: boolean
  created_at?: string
}

export interface AdminUserItem {
  id: string
  username: string
  display_name: string
  role: 'admin' | 'trader' | 'viewer'
  department?: string
  is_active: boolean
  created_at?: string
}

export interface BondItem {
  id: string
  code: string
  name: string
  full_name?: string
  bond_type: string
  issuer: string
  coupon_rate?: number
  coupon_type?: string
  credit_rating?: string
  remaining_term?: number
  created_at?: string
}

export interface QuoteItem {
  id: string
  bond_id: string
  source_id: string
  source_name?: string
  source_type?: string
  bid_price?: number
  ask_price?: number
  bid_yield?: number
  ask_yield?: number
  bid_volume?: number
  ask_volume?: number
  counterparty?: string
  quote_time?: string
  is_best: boolean
}

export interface SourceQuoteSummaryItem {
  source_name: string
  source_type: string
  best_bid_price?: number
  best_ask_price?: number
  best_bid_yield?: number
  best_ask_yield?: number
  quote_count: number
  latest_quote_time?: string
}

export interface AggregatedQuoteItem {
  bond: BondItem
  sources: SourceQuoteSummaryItem[]
  best_bid_price?: number
  best_ask_price?: number
  best_bid_yield?: number
  best_ask_yield?: number
  spread?: number
  total_quotes: number
}

export interface TradeItem {
  id: string
  bond_id: string
  source_id: string
  source_name?: string
  source_type?: string
  bond_code?: string
  bond_name?: string
  price: number
  yield_rate?: number
  volume: number
  amount?: number
  direction: string
  counterparty?: string
  trade_time?: string
}
