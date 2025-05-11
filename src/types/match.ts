export interface Match {
	id: number;
	tournoiId: number;
	pouleId?: number | null;
	competitor1Id: number;
	competitor2Id: number;
	score1: number;
	score2: number;
	keikokuCompetiteur1: number;
	keikokuCompetiteur2: number;
	isFinished: boolean;
  }
  