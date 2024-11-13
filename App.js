import React, { useState, useEffect } from 'react';
import { Button, StyleSheet, Text, TextInput, View, FlatList, TouchableOpacity, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const App = () => {
  
  const [nome, setNome] = useState('');
  const [endereco, setEndereco] = useState('');
  const [pedido, setPedido] = useState('');
  const [dadosSalvos, setDadosSalvos] = useState([]); // Estado para mostrar os dados salvos como um array

  // Salva informações no AsyncStorage
  const salvarDados = async () => {
    if (nome && endereco && pedido) { // Verifica se todos os campos estão preenchidos
      const novoCliente = { nomeCliente: nome, enderecoCliente: endereco, pedidoCliente: pedido };
      const novaLista = [...dadosSalvos, novoCliente]; // Adiciona o novo cliente à lista existente

      try {
        await AsyncStorage.setItem('clientes', JSON.stringify(novaLista)); // Salva a nova lista no AsyncStorage
        setDadosSalvos(novaLista); // Atualiza os dados exibidos na tela
        setNome(''); // Limpa o campo do nome
        setEndereco(''); // Limpa o campo do endereco
        setPedido(''); // Limpa o campo de pedido
      } catch (error) {
        console.error('Erro ao salvar os dados', error);
      }
    } else {
      alert('Preencha todos os campos!');
    }
  };

  // Função para carregar os dados salvos
  const carregarDados = async () => {
    try {
      const dadosSalvos = await AsyncStorage.getItem('clientes');
      if (dadosSalvos !== null) {
        setDadosSalvos(JSON.parse(dadosSalvos)); // Atualiza o estado com a lista de clientes
      }
    } catch (error) {
      console.error('Erro ao carregar os dados', error);
    }
  };

  // Função para deletar um cliente
  const deletarCliente = async (index) => {
    const novaLista = dadosSalvos.filter((_, idx) => idx !== index); // Remove o cliente da lista
    try {
      await AsyncStorage.setItem('clientes', JSON.stringify(novaLista)); // Atualiza o AsyncStorage
      setDadosSalvos(novaLista); // Atualiza o estado com a nova lista
    } catch (error) {
      console.error('Erro ao deletar os dados', error);
    }
  };

  // Função para mover um cliente para cima
  const moverParaCima = async (index) => {
    if (index > 0) {
      const novaLista = [...dadosSalvos];
      const [cliente] = novaLista.splice(index, 1); // Remove o cliente da posição atual
      novaLista.splice(index - 1, 0, cliente); // Insere o cliente na nova posição

      try {
        await AsyncStorage.setItem('clientes', JSON.stringify(novaLista)); // Atualiza o AsyncStorage
        setDadosSalvos(novaLista); // Atualiza o estado com a nova lista
      } catch (error) {
        console.error('Erro ao mover os dados', error);
      }
    }
  };

  // Função para mover um cliente para baixo
  const moverParaBaixo = async (index) => {
    if (index < dadosSalvos.length - 1) {
      const novaLista = [...dadosSalvos];
      const [cliente] = novaLista.splice(index, 1); // Remove o cliente da posição atual
      novaLista.splice(index + 1, 0, cliente); // Insere o cliente na nova posição

      try {
        await AsyncStorage.setItem('clientes', JSON.stringify(novaLista)); // Atualiza o AsyncStorage
        setDadosSalvos(novaLista); // Atualiza o estado com a nova lista
      } catch (error) {
        console.error('Erro ao mover os dados', error);
      }
    }
  };

  // Carregar os dados quando o componente for montado
  useEffect(() => {
    carregarDados();
  }, []);

  return (
    <ImageBackground
      source={require('./assets/background.png')}
      style = {styles.background}
    >
      <View style={styles.container}>
        <TextInput 
          style={styles.inputInfo}
          placeholder='Nome do cliente'
          value={nome}
          onChangeText={(text) => setNome(text)}
        />
        <TextInput
          style={styles.inputInfo}
          placeholder='Endereço'
          value={endereco}
          onChangeText={(text) => setEndereco(text)}
        />
        <TextInput 
          style={styles.inputInfo}
          placeholder='Pedido'
          value={pedido}
          onChangeText={(text) => setPedido(text)}
        />
        <TouchableOpacity style={styles.btnSalvar} onPress={salvarDados}>
          <Text style={styles.btnSalvarText}>Adicionar a lista</Text>
        </TouchableOpacity>

        {/* Exibe a lista de dados salvos */}
        <FlatList
          style={styles.containerCard}
          data={dadosSalvos}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.card}>
              <Text style={styles.cardText}>Nome: {item.nomeCliente}</Text>
              <Text style={styles.cardText}>Endereço: {item.enderecoCliente}</Text>
              <Text style={styles.cardText}>Pedido: {item.pedidoCliente}</Text>
              <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.aprovarButton} onPress={() => deletarCliente(index)}>
                  <Text style={styles.deleteButtonText}>Feito</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.moveButton} 
                  onPress={() => moverParaCima(index)} 
                  disabled={index === 0} // Desabilita o botão se já estiver no topo
                >
                  <Text style={styles.moveButtonText}>Cima</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.moveButton} 
                  onPress={() => moverParaBaixo(index)} 
                  disabled={index === dadosSalvos.length - 1} // Desabilita o botão se já estiver no fundo
                >
                  <Text style={styles.moveButtonText}>Baixo</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteButton} onPress={() => deletarCliente(index)}>
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    paddingTop: 60,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    backgroundColor: 'transparent',
  },
  inputInfo: {
    borderColor: '#000',
    height: 40,
    borderWidth: 1,
    width: '90%',
    textAlign: 'center',
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: '#F1F1F1',
    opacity: 0.7,
  },
  btnSalvar:{
    backgroundColor: '#3E7786',
    borderRadius: 5,
    width: '90%',
    height: 40,
    alignItems: 'center',
    paddingTop: 10
  },
  btnSalvarText:{
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16
  },
  containerCard:{
    width: '90%',
    marginTop: 16
  },
  card: {
    backgroundColor: '#FFF5E4',
    borderRadius: 10,
    padding: 20,
    marginVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
    borderColor: '#A8E6CF',
    borderWidth: 2,
  },
  cardText: {
    fontSize: 20,
    fontWeight: 'semi-bold',
    color: '#37474F',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-beetwen',
    marginTop: 10,
  },
  moveButton: {
    backgroundColor: '#A8E6CF',
    borderRadius: 5,
    width: '23%',
    height: 40,
    alignItems: 'center',
    marginRight: '3%',
  },
  moveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
    paddingTop: 7
  },
  deleteButton: {
    backgroundColor: '#ff4d4d',
    padding: 7,
    borderRadius: 5,
    alignItems: 'center',
    width: '23%',
    height: 40,
    marginRight: '3%',
  },
  aprovarButton: {
    backgroundColor: '#FFC5D9',
    padding: 7,
    borderRadius: 5,
    alignItems: 'center',
    width: '23%',
    height: 40,
    marginRight: '3%',
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
  },
});

export default App;
