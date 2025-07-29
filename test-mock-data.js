// Simple test to verify mock data service works
const { mockDataService } = require('./lib/api/mockDataService.ts');

async function testMockData() {
  console.log('Testing mock data service...');

  try {
    // Test team games for Dallas Cowboys
    const teamGamesResponse = await mockDataService.getTeamGames('dal', {
      upcomingOnly: false,
      count: 4,
    });

    console.log('Team games response:', {
      success: teamGamesResponse.success,
      gamesCount: teamGamesResponse.data?.length || 0,
      firstGame: teamGamesResponse.data?.[0] || null,
    });

    if (teamGamesResponse.success && teamGamesResponse.data?.length > 0) {
      const firstGame = teamGamesResponse.data[0];
      console.log('First game details:', {
        gameId: firstGame.gameId,
        week: firstGame.week,
        homeTeam: firstGame.homeTeam.abbreviation,
        awayTeam: firstGame.awayTeam.abbreviation,
        gameDate: firstGame.gameDate,
      });

      // Test board availability for the first game
      const boardsResponse = await mockDataService.getGameBoards(
        firstGame.gameId,
      );
      console.log('Boards response:', {
        success: boardsResponse.success,
        boardsCount: boardsResponse.data?.length || 0,
      });
    }
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testMockData();
