const steamKey = 'CDBD301F6C4CB0719A23C8B1A1CF73AA';
const steamUrl = 'https://api.steampowered.com/IDOTA2Match_570';

const teams = {
	VEGA 		: 2006913,
	OG   		: 2586976,
	VP   		: 1883502,
	NEWBEE 		: 1375614,
	UNKNOWN 	: 2350559,
	FNATIC 		: 350190,
	VG   		: 726228,
	EG   		: 39,
	ALLIANCE 	: 111474,
	NIP  		: 2085365
};

const tableParams = 'id, seriesId, seqNumber,team1Id, team2Id, seriesType, startTime';

export {steamKey, steamUrl, teams, tableParams}