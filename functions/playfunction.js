
export const playGame = (hunt, markers, navigation) => {
    navigation.navigate('MapScreen', {context: 'play', hunt: {hunt}, markers: markers})
}

export const playHunt = (navigation, hunt) => {

    navigation.navigate('ConfirmHunt', {hunt: hunt})
}