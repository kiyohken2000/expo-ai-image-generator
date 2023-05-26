import React, { useState } from 'react'
import { StyleSheet, Text, View, TextInput, Dimensions } from 'react-native'
import Button from '../../components/Button'
import { colors, fontSize } from '../../theme'
import ScreenTemplate from '../../components/ScreenTemplate'
import Spinner from 'react-native-loading-spinner-overlay'
import AutoHeightImage from 'react-native-auto-height-image';
import { Configuration, OpenAIApi } from "openai";
import "react-native-url-polyfill/auto";
import { apiKey } from '../../key'

const { width } = Dimensions.get('window')

export default function Home() {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const configuration = new Configuration({apiKey});
  const openai = new OpenAIApi(configuration);

  const generateImage = async () => {
    setLoading(true);
    try {
      const res = await openai.createImage({
        prompt: text,
        n: 1,
        size: "512x512",
      });
      setLoading(false);
      setResult(res.data.data[0].url);
    } catch (error) {
      setLoading(false);
      console.error(`Error generating image: ${error}`);
    }
  };
  
  return (
    <ScreenTemplate>
      <View style={styles.root}>
        <View style={{flex: 3}}>
          <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          {result?
            <AutoHeightImage
              width={width * 0.9}
              source={{ uri: result }}
              defaultSource={require('../../../assets/images/logo-lg.png')}
            />
            :
            <Text style={styles.text}>プロンプトを入力してボタンを押してください</Text>
            }
          </View>
        </View>
        <View style={{flex: 1, padding: 5}}>
          <TextInput
            style={styles.textInput}
            onChangeText={(text) => setText(text)}
            placeholder="Describe your idea"
            placeholderTextColor={colors.graySecondary}
            multiline={true}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            label="Generate"
            color={colors.lightPurple}
            labelColor={colors.white}
            disable={!text || text.length < 10}
            onPress={generateImage}
          />
        </View>
      </View>
      <Spinner
        visible={loading}
        textStyle={{ color: colors.white }}
        overlayColor="rgba(0,0,0,0.5)"
      />
    </ScreenTemplate>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  textInput: {
    backgroundColor: 'transparent',
    color: colors.black,
    padding: 5,
    fontSize: fontSize.large,
    borderWidth: 1,
    borderColor: colors.bluePrimary,
    flex: 1,
    borderRadius: 5
  },
  buttonContainer: {
    flex: 0.5,
    paddingHorizontal: 5,
    justifyContent: 'center'
  },
  image: {
    width: 100,
    height: 100,
  },
  text: {
    color: colors.black,
    fontSize: fontSize.large,
    fontWeight: "bold",
  },
})
