/**
 * drug interactions页面
 */

import React from 'react';
import { StyleSheet, View, Image, Text, TouchableHighlight, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { styles as commonStyles } from './styles/commonStyles';
import Toast from 'react-native-toast-message';
import config from "../config";
import { request } from '../utils/request';
import SyncStorage from '../utils/syncStorage';
import { white } from 'react-native-paper/lib/typescript/styles/colors';

const styles = StyleSheet.create({
    card: {
        marginTop: 30,
        width: 300,
        height: 80,
        borderRadius: 8,
        backgroundColor: "#fff",
        display:'flex',
        flexDirection :'row',
       
    },
    drugStyle: {
        width: 60,
        height: 60,
        marginLeft: 10,
        marginTop: 10,
        backgroundColor: "#eee",
        borderRadius: 10,
    },
    textStyle:{
        marginTop:10,
        marginLeft:11,
        lineHeight:12

    },
    texYitle:{
        fontSize:16
    },
    textDescription:{
        fontSize:14
    },
    searchTitle: {
        fontSize: 18,
        marginTop: 13,
        color: "#000"
    },
    inputView:{
        borderTopColor:"rgba(0, 0, 0, 0.12)",
        borderBottomColor:"rgba(0, 0, 0, 0.12)",
        fontSize:18,
        width: 250,
        borderTopWidth:1,
        borderBottomWidth:1,
        height:56,
        position: 'relative'
    },
    itemBox:{
        marginTop:12,
    },
    itemStyle:{
    width: 300,
    height: 47,
    marginBottom:7,
    backgroundColor:"white",
    display:'flex',
    flexDirection:'row',
    borderRadius:10,
    justifyContent:'space-around',
    alignItems:'center'
    
    },
    itemColorStyle:{
        color: "#222222",
        fontSize:16
    },
    descriptionColorStyle:{
        width:130,
    },
    searchButton: {
        right: 0,
        top: 13,
        position: 'absolute',
        width: 30,
        height: 30
    },
    searchIcon: {
        // right: 0,
        // top: 13,
        // position: 'absolute',
        width: 30,
        height: 30
    },
    conflict: {
        width: 300,
        height: 50,
        borderRadius: 40,
        marginTop: 20,
    },
    redColor: {
        backgroundColor: "#E62835",
    },
    greenColor: {
        backgroundColor: "#19AB5C"
    },
    orangeColor: {
        backgroundColor: "#F2994A"
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
      },
      modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
      },
      openButton: {
        backgroundColor: "#F194FF",
        borderRadius: 20,
        padding: 10,
        elevation: 2
      },
      textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
      },
      modalText: {
        marginBottom: 15,
        textAlign: "center"
      }
})

export class DrugInteractions extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            queryString: "",
            drugInfoList: [],
            drugList: [],
            selectedDrugs: [],
            isConflict: null,
            modalvisible: false,
            drugBankId: "",
            name: "",
            summary: "",
        }
    }

    handleChangeText(value) {
        this.setState({
            queryString: value
        })
    }

    handleSearch() {
        if (this.state.queryString.length === 0) {
            Toast.show({
                type: 'error',
                text1: 'query string is empty'
            })
        } else {
            const url = config.HOST + '/drug/search/' + this.state.queryString
            request(url, "GET", "", ((response) => {
                console.log(response)
                this.setState({
                    drugList: response.items,
                    drugInfoList: response.items,
                })
            }).bind(this))
        }
    }

    handleChangeConflictState(response){
        this.setState({
            isConflict: response.items.type
        })
    }

    handleSelectDrug(drugInfo) {
        const drugSelected = this.state.selectedDrugs
        console.log("选中的drug", drugInfo)
        console.log("已选的drug", drugSelected)
        drugSelected.push(drugInfo)
        this.setState({
            selectedDrugs: drugSelected
        }, ((drugInfo) => {
            // 查询药品冲突情况
            if (this.state.selectedDrugs.length > 1) {
                const url = config.HOST + "/drug/query"
                const idList = []
                this.state.selectedDrugs.forEach(item => idList.push(item.drugBankId))
                const payload = {
                    idList: idList
                }
                request(url, "POST", payload, this.handleChangeConflictState.bind(this))
            }
            // 从药品列表删除drug
            console.log(this.state.drugInfoList)
            const drugInfoList = []
            this.state.drugInfoList.forEach(item => {
                if (item.drugBankId !== drugInfo.drugBankId) {
                    drugInfoList.push(item)
                }
            })
            console.log("删除后的", drugInfoList)
            this.setState({
                drugInfoList: drugInfoList
            })
        }).bind(this, drugInfo))
    }

    selectedDrugsRender() {
        switch (this.state.isConflict) {
            case null :
                return <></>
            case "yes":
                return <View style={[styles.conflict, styles.redColor, commonStyles.center]}><Text style={{fontSize: 36, color: "#FFF"}}>Conflict</Text></View>
            case "no":
                return <View style={[styles.conflict, styles.greenColor, commonStyles.center]}><Text style={{fontSize: 36, color: "#FFF"}}>No Conflict</Text></View>
            case "unknown":
                return <View style={[styles.conflict, styles.orangeColor, commonStyles.center]}><Text style={{fontSize: 36, color: "#FFF"}}>Unknown</Text></View>
            default:
                return <View style={[styles.conflict, styles.orangeColor, commonStyles.center]}><Text style={{fontSize: 36, color: "#FFF"}}>Unknown</Text></View>
        }
    }

    handleDeleteDrug(drugInfo) {
        const selectedDrugs = []
        const drugInfoList = this.state.drugInfoList
        this.state.selectedDrugs.forEach(item => {
            if (item.drugBankId !== drugInfo.drugBankId) {
                selectedDrugs.push(item)
            }
        })
        drugInfoList.push(drugInfo)
        drugInfoList.sort()
        this.setState({
            selectedDrugs: selectedDrugs,
            drugInfoList: drugInfoList,
        })
        if (this.state.selectedDrugs.length < 2) {
            this.setState({
                isConflict: null
            })
        } 
    }

    handleDrugDetail(response) {
        if (response.code === 200) {
            this.setState({
                summary: response.item.summary,
                name: response.item.name,
                drugBankId: response.item.drugBankId
            })
        } else {
            Toast.show({
                type: "error",
                text1: "get drug detail failed"
            })
        }
    }

    setModalvisible(value, id) {
        this.setState({
            modalvisible: value
        })
        let url = config.HOST + "/drug/detail/" + id
        request(url, "GET", "", this.handleDrugDetail.bind(this))
    }

    render() {

        const DrugList = this.state.drugInfoList.map(item => {
            return (
                <View style={styles.itemBox} key={item.drugBankId}>
                    <View style={styles.itemStyle}>
                        <TouchableHighlight onPress={this.setModalvisible.bind(this, true, item.drugBankId)}>
                            <View>
                                <Text style={styles.itemColorStyle}>{item.name}</Text>
                                <Text style={styles.descriptionColorStyle} numberOfLines={1} ellipsizeMode={'tail'}>{item.summary}</Text>
                            </View>
                        </TouchableHighlight>
                        <Text onPress={this.handleSelectDrug.bind(this, item)}>add</Text>
                    </View>
                </View>
            )
        })

        const selectedDrugs = this.state.selectedDrugs.map(item => {
            return (
                <TouchableOpacity onLongPress={this.handleDeleteDrug.bind(this, item)}>
                    <View style={styles.card} key={item.drugBankId}>
                        {/* drug 图片 */}
                        <Image style={styles.drugStyle} source={{
                            uri: "https://s3-alpha-sig.figma.com/img/96f9/9518/c51d7fdfaef2d0277aa0f7b0761bba35?Expires=1647216000&Signature=HeDIZWY~~XSybnNkvQCzwP2yP4XlPaNLgAfsNSRsNNBeTpVTnIj8UsuJyiKOBcNZo6~hr6psmNMfyuXGmXKGdoxdRM8DgcXfOwPYgiM58eWRgqHJC7mxNzvGQzElHOifM~mzK6hmPBdzR6c-yySVtDnYGn35faT-eOpOoBb3-IlgaIAzh~r7c90lyvhn82XcqE6Jta-6Q1GFz~XFxCuD8LioKlGKSzaRc24uzjqVXkl6hCzLnFS785d2-FvjoOHBrONEvwh-axdYvRcg3~OJbKpOjgLO6RIjACffmhmXIzY8WVCf8usnte644b8Mmeqw-kHpaUo4D9W2kOeuj8PALQ__&Key-Pair-Id=APKAINTVSUGEWH5XD5UA"
                        }}></Image>
                        {/* 药品名称 */}
                        <View style={styles.textStyle} >
                            <Text style={styles.texYitle} ellipsizeMode={'tail'}>{item.name}</Text>
                            <Text style={styles.textDescription} numberOfLines={1} ellipsizeMode={'tail'}>{item.summary}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            )
        })

        return (
            <View style={commonStyles.center}>
                {/* 是否冲突显示 */}
                {this.selectedDrugsRender()}
                {/* 已选择的Drug */}
                {selectedDrugs.length ? <View style={{ height: 180, marginTop: 10}}>
                    <ScrollView content>
                        {selectedDrugs}
                    </ScrollView>
                </View> : <></>}
                <View  style={styles.inputStyle} >
                <Text style={styles.searchTitle}>Search for drugs</Text>
                <View style={styles.inputView}>
                    <TextInput 
                        value={this.state.queryString}
                        onChangeText={this.handleChangeText.bind(this)}
                    />
                    <TouchableHighlight onPress={this.handleSearch.bind(this)} style={styles.searchButton}>
                        <Image source={require("../static/search.png")} style={styles.searchIcon}></Image>
                    </TouchableHighlight>
                </View>
                </View>
                {/* 商品部分 */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.modalvisible}
                    onRequestClose={() => {
                      Alert.alert("Modal has been closed.");
                      this.setModalVisible(false);
                    }}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                        <Text style={styles.modalText}>DrugBankId: {this.state.drugBankId}</Text>
                        <Text style={styles.modalText}>Name: {this.state.name}</Text>
                        <Text style={styles.modalText}>Summary: {this.state.summary}</Text>
                        <TouchableHighlight
                            style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                            onPress={this.setModalvisible.bind(this, false)}
                        >
                            <Text style={styles.textStyle}>Close</Text>
                        </TouchableHighlight>
                        </View>
                    </View>
                </Modal>
                <View style={{height: 330}}>
                    <ScrollView>
                        {DrugList}
                    </ScrollView>
                </View>
            </View>
            
        )
    }
}