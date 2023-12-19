import React, { Component } from 'react';
import { View, Text, FlatList, Image, StyleSheet, Pressable } from 'react-native';
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
    }, 0.5 * 60 * 1000); // 5 minutes in milliseconds
  }

  componentWillUnmount() {
    // Clear the interval when the component is unmounted
    clearInterval(this.refreshInterval);
  }

  async loadGames() {
    const currentDate = new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }).split(',')[0];
    const url = `https://www.balldontlie.io/api/v1/games?start_date=${currentDate}&end_date=${currentDate}`;


    try {
      const response = await axios.get(url, {
        headers: {
          Accept: 'application/json',
        },
      });

      // Load team logos
      const teamLogos = await this.loadTeamLogos(response.data.data);

      this.setState({ games: response.data.data, teamLogos });
    } catch (e) {
      console.log(e);
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
    // Get the local time string
    const localTime = localDate.toLocaleTimeString();
  
    return localTime;
  }

  toggleGameExpansion(index) {
    this.setState((prevState) => ({
      expandedGameIndex: prevState.expandedGameIndex === index ? null : index,
    }));
  }

  renderGameItem = ({ item, index }) => {
    const { teamLogos } = this.state;
    const isExpanded = this.state.expandedGameIndex === index;


    const isScheduled = item.status.toLowerCase().includes('scheduled') || item.status.toLowerCase().includes('pre-game');
    const displayTime = isScheduled ? item.time : this.getFormattedTime(item.status);


    return (
      <View style={{backgroundColor:'#f7f7f7'}}>
        <Pressable
          onPress={() => this.toggleGameExpansion(index)}
          style={({ pressed }) => ({
            backgroundColor: pressed ? 'lightgrey' : '#f7f7f7', // Change background color on press
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
        </Pressable>
        {isExpanded && (
          <View style={styles.dropdownContainer}>
            <Text>Top Scorer for {item.home_team.full_name}: {item.home_team_top_scorer}</Text>
            <Text>Top Scorer for {item.visitor_team.full_name}: {item.visitor_team_top_scorer}</Text>
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
      />
    );
  }
}


const styles = StyleSheet.create({
  // ... (your existing styles)

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
    alignItems: 'flex-start',
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
});

export default GamesScreen;