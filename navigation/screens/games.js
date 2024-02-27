import React, { Component } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';

// Define an object with logo names and paths
const logos = {
  atlantahawks: require('./logos/atlantahawks.png'),
  bostonceltics: require('./logos/bostonceltics.png'),
  brooklynnets: require('./logos/brooklynnets.png'),
  charlottehornets: require('./logos/charlottehornets.png'),
  chicagobulls: require('./logos/chicagobulls.png'),
  clevelandcavaliers: require('./logos/clevelandcavaliers.png'),
  dallasmavericks: require('./logos/dallasmavericks.png'),
  denvernuggets: require('./logos/denvernuggets.png'),
  detroitpistons: require('./logos/detroitpistons.png'),
  goldenstatewarriors: require('./logos/goldenstatewarriors.png'),
  houstonrockets: require('./logos/houstonrockets.png'),
  indianapacers: require('./logos/indianapacers.png'),
  laclippers: require('./logos/losangelesclippers.png'),
  losangeleslakers: require('./logos/losangeleslakers.png'),
  memphisgrizzlies: require('./logos/memphisgrizzlies.png'),
  miamiheat: require('./logos/miamiheat.png'),
  milwaukeebucks: require('./logos/milwaukeebucks.png'),
  minnesotatimberwolves: require('./logos/minnesotatimberwolves.png'),
  neworleanspelicans: require('./logos/neworleanspelicans.png'),
  newyorkknicks: require('./logos/newyorkknicks.png'),
  oklahomacitythunder: require('./logos/oklahomacitythunder.png'),
  orlandomagic: require('./logos/orlandomagic.png'),
  philadelphia76ers: require('./logos/philadelphia76ers.png'),
  phoenixsuns: require('./logos/phoenixsuns.png'),
  portlandtrailblazers: require('./logos/portlandtrailblazers.png'),
  sacramentokings: require('./logos/sacramentokings.png'),
  sanantoniospurs: require('./logos/sanantoniospurs.png'),
  torontoraptors: require('./logos/torontoraptors.png'),
  utahjazz: require('./logos/utahjazz.png'),
  washingtonwizards: require('./logos/washingtonwizards.png'),
};

class GamesScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      games: [],
      teamLogos: {},
      expandedGameIndex: null,
    };
    this.refreshInterval = null; // Variable to store the interval reference
  }

  componentDidMount() {
    this.loadGames(); // Initial load

    // Set up an interval to refresh the games every 5 minutes (adjust the interval as needed)
    this.refreshInterval = setInterval(() => {
      this.loadGames();
    }, 5 * 60 * 1000); // 5 minutes in milliseconds
  }

  componentWillUnmount() {
    // Clear the interval when the component is unmounted
    clearInterval(this.refreshInterval);
  }

  async loadGames() {
    const currentDate = new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }).split(',')[0];
    const testDate = '2024-01-02';
    const url = `https://www.balldontlie.io/api/v1/games?start_date=${currentDate}&end_date=${currentDate}`;

    try {
      const response = await axios.get(url, {
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response || !response.data || !response.data.data) {
        throw new Error('Invalid or empty response.');
      }

      const games = response.data.data;

      // Fetch stats for each game and update with top scorers
      const gamesWithStats = [];
      for (const game of games) {
        const topScorers = await this.getTopScorersForGame(game.id, game);
        if (topScorers) {
          game.home_team_top_scorer = topScorers.homeTeam.topScorer;
          game.home_team_pts = topScorers.homeTeam.points
          game.home_team_rebs = topScorers.homeTeam.rebs
          game.home_team_ast = topScorers.homeTeam.asts

          game.visitor_team_top_scorer = topScorers.visitorTeam.topScorer;
          game.visitor_team_pts = topScorers.visitorTeam.points
          game.visitor_team_rebs = topScorers.visitorTeam.rebs
          game.visitor_team_ast = topScorers.visitorTeam.asts
        }
        gamesWithStats.push(game);
      }

      // Sort games based on start time
      const sortedGames = gamesWithStats.sort((a, b) => {
        const startTimeA = new Date(a.status).getTime();
        const startTimeB = new Date(b.status).getTime();
        return startTimeA - startTimeB;
      });

      // Load team logos
      const teamLogos = await this.loadTeamLogos(sortedGames);

      this.setState({ games: sortedGames, teamLogos });
    } catch (e) {
      console.error('Error loading games:', e);
    }
  }


  async getTopScorersForGame(game_id, game) {
    try {
      const statsUrl = `https://www.balldontlie.io/api/v1/stats?game_ids[]=${game_id}&per_page=100`;
      const statsResponse = await axios.get(statsUrl, {
        headers: {
          Accept: 'application/json',
        },
      });
  
      if (!statsResponse || !statsResponse.data || !statsResponse.data.data) {
        throw new Error(`Invalid or empty stats response for game ${game_id}.`);
      }
  
      const allPlayerStats = statsResponse.data.data;
      let homeTeamTopScorer = null;
      let visitorTeamTopScorer = null;
  
      allPlayerStats.forEach((playerStat) => {
        if (playerStat.team.id === game.home_team.id) {
          if (!homeTeamTopScorer || playerStat.pts > homeTeamTopScorer.pts) {
            homeTeamTopScorer = playerStat;
          }
        } else if (playerStat.team.id === game.visitor_team.id) {
          if (!visitorTeamTopScorer || playerStat.pts > visitorTeamTopScorer.pts) {
            visitorTeamTopScorer = playerStat;
          }
        }
      });
  
      const homeTeamPoints = homeTeamTopScorer ? homeTeamTopScorer.pts || 0 : 0;
      const homeTeamRebs = homeTeamTopScorer ? homeTeamTopScorer.reb || 0 : 0;
      const homeTeamAsts = homeTeamTopScorer ? homeTeamTopScorer.ast || 0 : 0;
      const visitorTeamPoints = visitorTeamTopScorer ? visitorTeamTopScorer.pts || 0 : 0;
      const visitorTeamRebs = visitorTeamTopScorer ? visitorTeamTopScorer.reb || 0 : 0;
      const visitorTeamAsts = visitorTeamTopScorer ? visitorTeamTopScorer.ast || 0 : 0;
  
      return {
        homeTeam: {
          topScorer: homeTeamTopScorer
            ? `${homeTeamTopScorer.player.first_name} ${homeTeamTopScorer.player.last_name}`
            : 'N/A',
          points: homeTeamPoints,
          rebs: homeTeamRebs,
          asts: homeTeamAsts,
        },
        visitorTeam: {
          topScorer: visitorTeamTopScorer
            ? `${visitorTeamTopScorer.player.first_name} ${visitorTeamTopScorer.player.last_name}`
            : 'N/A',
          points: visitorTeamPoints,
          rebs: visitorTeamRebs,
          asts: visitorTeamAsts,
        },
      };
    } catch (error) {
      console.error(`Error fetching top scorers for game ${game_id}:`, error.message);
      return null;
    }
  }

  
  getLogoFileName(teamName) {
    return teamName.replace(/\s+/g, '').toLowerCase();
  }

  async loadTeamLogos(games) {
    const teamLogos = {};

    games.forEach((game) => {
      // Use dynamic import based on the logo name
      const homeTeamLogo = logos[this.getLogoFileName(game.home_team.full_name)];
      const visitorTeamLogo = logos[this.getLogoFileName(game.visitor_team.full_name)];

      teamLogos[game.home_team.full_name] = homeTeamLogo;
      teamLogos[game.visitor_team.full_name] = visitorTeamLogo;
    });

    return teamLogos;
  }

  getFormattedTime(date) {
    // Convert the UTC date to local time
    const localDate = new Date(date);
  
    // Get the hours, minutes, and AM/PM
    let hours = localDate.getHours();
    const minutes = localDate.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
  
    // Convert hours to 12-hour format
    hours = hours % 12 || 12;
  
    // Ensure that single-digit minutes are formatted with a leading zero
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  
    // Construct the formatted time string
    const formattedTime = `${hours}:${formattedMinutes} ${ampm}`;
  
    return formattedTime;
  }

  toggleGameExpansion(index) {
    this.setState((prevState) => ({
      expandedGameIndex: prevState.expandedGameIndex === index ? null : index,
    }));
  }

  renderGameItem = ({ item, index }) => {
    const { teamLogos } = this.state;
    const isExpanded = this.state.expandedGameIndex === index;

    const isValidDate = !isNaN(new Date(item.status).getTime());
    const displayTime = isValidDate ? this.getFormattedTime(item.status) : item.time;

    return (
      <View style={{ backgroundColor: '#f7f7f7' }}>
        <TouchableOpacity
          onPress={() => this.toggleGameExpansion(index)}
          style={({ pressed }) => ({
            backgroundColor: pressed ? 'lightgrey' : '#f7f7f7',
          })}
        >
          <View style={styles.gameContainer}>
            <View style={styles.teamContainer}>
              <View style={styles.logoContainer}>
                <Image source={teamLogos[item.home_team.full_name]} style={styles.logo} resizeMode="contain" />
              </View>
              <Text>{item.home_team.full_name}</Text>
              <Text>{item.home_team_score}</Text>
            </View>
            <View style={styles.vsContainer}>
              <Text style={styles.vsText}>vs</Text>
              <View style={styles.qContainer}>
                <Text>{displayTime}</Text>
              </View>
            </View>
            <View style={styles.teamContainer}>
              <View style={styles.logoContainer}>
                <Image source={teamLogos[item.visitor_team.full_name]} style={styles.logo} resizeMode="contain" />
              </View>
              <Text>{item.visitor_team.full_name}</Text>
              <Text>{item.visitor_team_score}</Text>
            </View>
          </View>
        </TouchableOpacity>
        {isExpanded && (
          <View style={styles.dropdownContainer}>
          <View style={styles.topPerformerContainer}>
              <Text style={styles.topScorerText}>{item.home_team.full_name}</Text>
              <Text style={styles.topScorerName}>{item.home_team_top_scorer}</Text>
            </View>
            <View style={styles.statsContainer}>
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>PTS</Text>
                <Text style={styles.statValue}>{item.home_team_pts}</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>REB</Text>
                <Text style={styles.statValue}>{item.home_team_rebs}</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>AST</Text>
                <Text style={styles.statValue}>{item.home_team_ast}</Text>
              </View>
            </View>

            <View style={styles.topPerformerContainer}>
              <Text style={styles.topScorerText}>{item.visitor_team.full_name}</Text>
              <Text style={styles.topScorerName}>{item.visitor_team_top_scorer}</Text>
            </View>
            <View style={styles.statsContainer}>
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>PTS</Text>
                <Text style={styles.statValue}>{item.visitor_team_pts}</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>REB</Text>
                <Text style={styles.statValue}>{item.visitor_team_rebs}</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>AST</Text>
                <Text style={styles.statValue}>{item.visitor_team_ast}</Text>
              </View>
            </View>
          </View>
        )}
      </View>
    );
  };


  renderSeparator = () => {
    return <View style={styles.separator} />;
  };

  render() {
    const { games } = this.state;

    return (
      <FlatList
        data={games}
        keyExtractor={(item, index) => index.toString()}
        renderItem={this.renderGameItem}
        ItemSeparatorComponent={this.renderSeparator}
        showsVerticalScrollIndicator={false}
      />
    );
  }
}


const styles = StyleSheet.create({

  gameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    margin: 10,
    borderWidth: 1,
    backgroundColor: 'white',
    borderColor: '#f7f7f7',
  },
  teamContainer: {
    flex: 1,
    alignItems: 'center',
  },
  logoContainer: {
    width: 50,
    height: 50,
    padding: 5, // Add padding around the logo
  },
  logo: {
    width: '100%',
    height: '100%',
    marginBottom: 5,
  },
  vsContainer: {
    width: 60, // Adjust the width as needed
    alignItems: 'center',
  },
  vsText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  qContainer: {
    flex: 1,
    width: 80, // Adjust the width as needed
    alignItems: 'center',
  },
  separator: {
    height: 1,
    backgroundColor: 'light-gray', // Divider color
  },
  dropdownContainer: {
    backgroundColor: 'white',
    padding: 10,
    elevation: 5, // Add elevation to make it appear above other elements
    backgroundColor: '#ebebeb',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  statBox: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black', // Black color for labels
  },
  statValue: {
    fontSize: 18,
    color: '#333', // Dark grey color for values
  },
  topPerformerContainer: {
    marginBottom: 10,
    backgroundColor: '#f5f5f5', // Light grey background
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  topScorerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333', // Dark grey
    marginBottom: 5,
  },
  topScorerName: {
    fontSize: 16,
    color: '#333333', // Dark grey
  },
});

export default GamesScreen;