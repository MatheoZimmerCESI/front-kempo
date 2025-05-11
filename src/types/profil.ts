/**
 * Pour GET /profile
 */
export interface CompetiteurProfile {
  id:           number
  firstname:    string
  surname:      string
  birthday:     string | null
  sex:          string | null
  weight:       number | null
  countryId:    number | null
  clubId:       number | null
  gradeId:      number | null
  pays:         { id: number; name: string } | null
  club:         { id: number; name: string } | null
  grade:        { id: number; name: string } | null
}

export interface ProfileResponse {
  id:          number
  email:       string
  createdAt:   string
  updatedAt:   string
  competiteur: CompetiteurProfile | null
  roles:       string[]
}

/**
 * Type pour ton formulaire Vue
 */
export interface ProfileForm {
  id:         number
  email:      string
  createdAt?: string
  firstname:  string
  surname:    string
  birthday?:  string
  sex?:       'M' | 'F'
  weight?:    number
  countryId?: number
  clubId?:    number
  gradeId?:   number
}

export interface MessageResponseProfile {
  message: string
}
