// src/types/competiteur.ts

export interface Competiteur {
	id?:        number
	firstname:  string
	surname:    string
	birthday?:  string      // 'YYYY-MM-DD' ou vide
	sex?:       'M' | 'F'
	weight?:    number
	countryId?: number
	clubId?:    number
	gradeId?:   number
	email:      string
	userId:     number
  }
  