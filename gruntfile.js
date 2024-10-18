//module.exports = function(grunt): Exporta uma função que contém a configuração do Grunt. Isso permite que o Grunt acesse o arquivo para configurar e registrar as tarefas.
module.exports = function(grunt){
    //grunt.initConfig: Inicializa a configuração do Grunt. Aqui, você está configurando a tarefa less, onde define como os arquivos .less devem ser processados tanto para desenvolvimento quanto para produção.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'), // // Lê o arquivo package.json e armazena os dados dentro de `pkg`


        //less:development:
        //A tarefa de desenvolvimento compila o arquivo main.less para main.css, mas não o comprime. O CSS gerado será mais fácil de ler e será salvo em dev/styles/main.css.
        less:{ // Configura o Grunt para usar o plugin LESS
            development:{ // Configura a tarefa para ambiente de desenvolvimento
                files:{
                    'dev/styles/main.css' : 'src/styles/main.less' // Gera um arquivo não compactado na pasta de desenvolvimento
                }
            },

            //less:production:
            //A tarefa de produção compila e comprime o arquivo main.less para main.min.css. O CSS resultante será minificado e salvo em dist/styles/main.min.css. Isso ajuda a reduzir o tamanho dos arquivos para melhorar a performance em produção.
            production:{ // Configura a tarefa para ambiente de produção
                options:{  
                    compress:true // Compacta o CSS no modo produção
                },
                files:{
                    'dist/styles/main.min.css' : 'src/styles/main.less' // Gera um arquivo CSS compactado na pasta de produção
                }
            },
        },
        //watch: É a tarefa do Grunt que monitora mudanças em arquivos e executa uma ação automaticamente quando um arquivo é alterado.
        watch:{
            //Nome da subtarefa, aqui está configurada para monitorar arquivos relacionados ao Less.
            less:{
                //'src/styles/**/*.less': Significa que o Grunt está monitorando todos os arquivos Less na pasta src/styles/ e em qualquer subdiretório.
                files:['src/styles/**/*.less'], //Especifica quais arquivos serão monitorados.
                
                // Indica quais tarefas devem ser executadas quando algum dos arquivos monitorados sofrer alterações. Aqui, a tarefa less:development será executada automaticamente quando qualquer arquivo Less for modificado. A tarefa less:development compila os arquivos Less em CSS durante o desenvolvimento.
                tasks:['less:development']
            },
            html:{
                files:['src/index.html'],
                tasks:['replace:dev']
            }
        },
        //Tarefa replace: É uma tarefa que substitui partes específicas de um ou mais arquivos por outras partes definidas, usando padrões (no caso, patterns).
        replace:{
            dev:{// Nome da tarefa/ambiente "dev"
                options:{
                    //Padrões de substituição (patterns): O código está procurando pelo texto ENDERECO_DO_CSS no arquivo src/index.html e substituindo esse texto por './styles/main.css'.
                    patterns: [  // Padrões de substituição
                        {
                            match:'ENDERECO_DO_CSS',  // O texto que você deseja encontrar
                            replacement:'./styles/main.css' // O novo valor que substituirá 'ENDERECO_DO_CSS'
                        },
                        {
                            match:'@@ENDERECO_DO_JS',  // O texto que você deseja encontrar
                            replacement:'../src/scripts/main.js' // O novo valor que substituirá 'ENDERECO_DO_CSS'
                        }
                    ]
                },
                files:[ // Arquivos onde as substituições serão feitas
                    {
                        expand:true, // Permite que vários arquivos sejam processados
                        flatten:true, // Remove a estrutura de pastas original, ou seja, o arquivo será colocado diretamente no diretório dev/ sem recriar a hierarquia de pastas.
                        src: ['src/index.html'], // Arquivo(s) de origem onde será feita a substituição
                        dest: 'dev/'  // Pasta de destino onde o arquivo modificado será salvo
                    }
                ]
            },
            //Objetivo: Substituir o texto ENDERECO_DO_CSS no arquivo prebuild/index.html por './styles/main.min.css'.
            dist:{
                options:{
                   //patterns: Contém o padrão que será substituído, que é match: 'ENDERECO_DO_CSS'. O valor replacement: './styles/main.min.css' indica o texto que irá substituir o padrão encontrado.
                    patterns: [
                        {
                            match:'ENDERECO_DO_CSS',  
                            replacement:'./styles/main.min.css' 
                        }
                    ]
                },
                //files: Especifica que a substituição ocorrerá no arquivo prebuild/index.html, e o arquivo modificado será salvo na pasta dist/.
                files:[ 
                    {
                        expand:true, //Permite trabalhar com múltiplos arquivos.
                        flatten:true,//  Remove a estrutura de diretórios da origem ao copiar o arquivo para o destino, ou seja, o arquivo será salvo diretamente na pasta dist/.
                        src: ['prebuild/index.html'], 
                        dest: 'dist/'  
                    }
                ]
            }
        },
        //Objetivo: Minificar o arquivo HTML, removendo espaços em branco desnecessários e comentários.
        htmlmin:{
            dist:{
                options:{
                    removeComments:true,
                    collapseWhitespace:true,
                },
                //files: O arquivo src/index.html será minificado e salvo como prebuild/index.html. Isso cria uma versão otimizada do arquivo original.
                files:{
                    'prebuild/index.html' : 'src/index.html'
                }
            }
        },
        //Objetivo: Limpar (ou seja, deletar) a pasta ou arquivos especificados após o uso.
        clean:['prebuild']
        //prebuild: Indica que a pasta prebuild será excluída após o término das tarefas. Isso é útil para remover arquivos temporários criados durante o processo de build.
    })

    //Carrega o plugin Less do Grunt, o qual você instalou anteriormente via npm, para compilar arquivos .less em .css.
    grunt.loadNpmTasks('grunt-contrib-less')
    grunt.loadNpmTasks('grunt-contrib-watch')
    grunt.loadNpmTasks('grunt-replace')
    grunt.loadNpmTasks('grunt-contrib-htmlmin')
    grunt.loadNpmTasks('grunt-contrib-clean')

    //'default': Define a tarefa que será executada por padrão se você apenas rodar o comando grunt. Ela compilará o Less no modo desenvolvimento.
    //grunt.registerTask('default', ['less:development'])


    grunt.registerTask('default', ['watch'])

    //'build': Registra uma tarefa customizada chamada build, que compila o Less no modo produção quando você executa grunt build.
    grunt.registerTask('build',['less:production', 'htmlmin:dist', 'replace:dist', 'clean'])
    //htmlmin: A primeira tarefa minifica o arquivo src/index.html e cria uma versão otimizada em prebuild/index.html.
    //replace: Após a minificação, o código replace substitui o placeholder ENDERECO_DO_CSS em prebuild/index.html pelo caminho real do CSS minificado (./styles/main.min.css), salvando o resultado na pasta dist/.
    //clean: Por último, a tarefa clean exclui a pasta prebuild, removendo o arquivo temporário criado no processo.

}

