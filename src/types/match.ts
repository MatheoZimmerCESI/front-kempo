export interface Match {
	id?: number
	id_tournoi: number
	id_poule?:             number | null
	id_competiteur1: number
	id_competiteur2: number
	score1: number
	score2: number
	keikoku_competiteur1: number
	keikoku_competiteur2: number
	is_finished: boolean 	/** Indique si le match est terminé */
  }
  