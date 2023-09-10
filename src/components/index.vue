<template lang="html" src="./index.html" />


<script>

import Movement from './movement/movement.vue'

export default {
    name: 'CrudContainer',
    components: {
        Movement
    },
    data() {
        return {
            containers: [],
            movements: [],
            propsData:null,
            cliente: null,
            numContainer: null,
            tipo: null,
            status: null,
            categoria: null,
            errorMsgModal: null,
            selectedCont: null,
            show: false,
            selectedStatus: null,
            selectedCategoria: null,
            totalImport: null,
            totalExport: null,
        };
    },
    watch:{
        selectedCategoria(newVal){
            console.log(newVal)
            if(newVal){
               this.filterByCat(newVal);
            }
            else{
                this.getContainers();
            }
        },
        selectedStatus(newVal){
            if(newVal){
                this.filterByStatus(newVal);
            }else{
                this.getContainers();
            } 
        }
    },
    created: function () {
        this.getContainers();
        this.getMovements();
        
    },
    methods: {
        getContainers() {
            this.axios
                .get('http://localhost:8080/container')
                .then(async (response) => {
                    if (response.status === 200) {
                        this.containers = await response.data;
                        this.calcularTotais();
                    } else {
                        throw console.log("Não foi possível Linha30");
                    }
                })
            
        },
        filterByStatus(){
            this.axios
            .get('http://localhost:8080/container/status',{
                params:{
                    statusContainer: this.selectedStatus
                },
            })
            .then( async (response)=>{
                console.log(response)
                if(response.status === 200){
                    
                    this.containers = await response.data;
                }else{
                    throw console.log(response.status);
                }
                
            })
        },
        filterByCat(){
            this.axios
            .get('http://localhost:8080/container/categoria', {
                params:{
                    categoria: this.selectedCategoria
                },
            })
            .then( async (response) =>{
                if(response.status === 200){
                    this.containers = await response.data;
                }else{
                    throw console.log(response.status);
                }
            })

        },
        hideModalCadContainer() {
            this.$refs['modalCadContainer'].hide();
            this.$refs['modalCadContainerUpdate'].hide();
            this.clearContForm();
        },
        cadContainer() {
            if (this.validation()) {
                const data = {
                    cliente: this.cliente,
                    numContainer: this.numContainer.toUpperCase(),
                    tipo: this.tipo,
                    statusContainer: this.status,
                    categoria: this.categoria
                }
                this.axios
                    .post('http://localhost:8080/container', data)
                    .then(async (response) => {
                        if (response.status === 200) {
                            await this.getContainers();
                        }
                    }).finally(() => {
                        this.hideModalCadContainer();
                        this.clearContForm();
                    })
            }
        },
        alterContainer() {
            if (this.validation()) {
                const data = {
                    idContainer: this.selectedCont.idContainer,
                    cliente: this.cliente,
                    numContainer: this.numContainer.toUpperCase(),
                    tipo: this.tipo,
                    statusContainer: this.status,
                    categoria: this.categoria
                }
                this.axios
                    .put('http://localhost:8080/container', data)
                    .then(async (response) => {
                        if (response.status === 200) {
                            await this.getContainers();
                        }
                    }).finally(() => {
                        this.hideModalCadContainer();
                        this.clearContForm();
                    })
                }
        },
        validation() {
            this.errorMsgModal = null;
            const formatacaoCont = /^[A-Za-z]{4}[0-9]{7}$/;
            const formatacaoCliente = /^[A-Za-z\s]+$/;


            if (this.cliente === null || this.cliente === "" || this.cliente.length < 3
                || !formatacaoCliente.test(this.cliente)) {
                throw this.errorMsgModal = "Nome inválido";
            }
            if (!formatacaoCont.test(this.numContainer)) {
                throw this.errorMsgModal = "Padrão de container incorreto";
            }
            if (this.tipo === null || this.tipo === "") {
                throw this.errorMsgModal = "Selecione o Tipo";
            }
            if (this.status === null || this.status === "") {
                throw this.errorMsgModal = "Selecione o Status";
            }
            if (this.categoria === null || this.categoria === "") {
                throw this.errorMsgModal = "Selecione a Categoria";
            }
            this.errorMsgModal = "";
            return true;
        },
        clearContForm() {
            this.cliente = null;
            this.numContainer = null;
            this.tipo = null;
            this.categoria = null;
            this.status = null;
            this.errorMsgModal = "";

        },
        deleteContainer(id) {
            this.axios
                .delete('http://localhost:8080/container/' + id)
                .then(async (response) => {
                    if (response.status === 200) {
                        await this.getContainers();
                    }
                })
        },
        openContentModal(container) {

            this.selectedCont = container;
            this.cliente = container.cliente;
            this.numContainer = container.numContainer;
            this.tipo = container.tipo;
            this.status = container.statusContainer;
            this.categoria = container.categoria;
            this.$bvModal.show('modal-2');
        },
        registrarMovement(container){
            this.propsData = container
            this.$bvModal.show('modal-3');
        },

        calcularTotais(){
            this.totalExport = 0;
            this.totalImport = 0;

            this.containers.forEach( (container)=>{
                if (container.categoria === 'Importação'){
                    this.totalImport ++;
                } else if (container.categoria === 'Exportação'){
                    this.totalExport++;
                }
            });
        }
        

    }
}
</script>

<style lang="scss" src="./style.scss" />
