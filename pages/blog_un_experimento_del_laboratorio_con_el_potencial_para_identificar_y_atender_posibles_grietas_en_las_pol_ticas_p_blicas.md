# Un experimento del Laboratorio con el potencial para identificar y atender posibles grietas en las políticas públicas

[[type:blog]]

[[source:https://www.undp.org/es/mexico/blog/un-experimento-del-laboratorio-con-el-potencial-para-identificar-y-atender-posibles-grietas-en-las-pol%C3%ADticas-p%C3%BAblicas]]

[Original article published here](https://www.undp.org/es/mexico/blog/un-experimento-del-laboratorio-con-el-potencial-para-identificar-y-atender-posibles-grietas-en-las-pol%C3%ADticas-p%C3%BAblicas)


[[date:16 DE DICIEMBRE DE 2021]]

[[continent:North America]]

[[country:Mexico]]



Pasar al contenido principal
México
QUIÉNES SOMOS
QUÉ HACEMOS
NUESTRO IMPACTO
INVOLÚCRATE
Global
Search
HOME
MÉXICO
BLOG
UN EXPERIMENTO DEL LABORATORIO CON EL POTENCIAL PARA IDENTIFICAR Y ATENDER POSIBLES GRIETAS EN LAS POLÍTICAS PÚBLICAS
Un experimento del Laboratorio con el potencial para identificar y atender posibles grietas en las políticas públicas
16 DE DICIEMBRE DE 2021
Autor
LUIS FERNANDO CERVANTES
Jefe de Experimentación
Foto: Michael Dziedzic en Unsplash
Un experimento de inteligencia colectiva para asimilar los aprendizajes a los que llegan las personas operadoras de programas presupuestales y que están en primera fila de la implementación de programas públicos.
En el blog anterior sentamos las bases de un experimento de minería de texto que realizamos en el Laboratorio de Aceleración del PNUD en México, para asimilar de forma colectiva los principales aprendizajes a los que llegan las personas que están en primera fila de la implementación de programas públicos. En esta entrada te compartimos los principales resultados y recomendaciones para la arquitectura del Sistema de Evaluación del Desempeño como una inteligencia colectiva que ayude a la mejorar de forma continua los programas públicos.
El algoritmo de similitud
El objetivo del experimento era encontrar una forma de hacer sentido, de forma agregada, de los miles de registros de texto ingresados por las personas en el Sistema de Evaluación del Desempeño. En ellos, las personas explican las razones que, a su saber, mejor explican por qué no se alcanzó cierta meta a la que se habían comprometido. El algoritmo de similitud que desarrollamos evalúa coincidencias de los textos con las causas predefinidas que contiene la GUIA que la Secretaría de Hacienda y Crédito Público envía cada año a las dependencias, y lo hace de forma independiente. Es decir, que un mismo texto puede resultar similar a varias de las causas. Lo que nos dice que la persona posiblemente está hablando de una mezcla de varias.
El algoritmo no es perfecto, pero tiene la capacidad de aprender. Se realizaron una serie de pruebas para validar que en efecto la medida de similitud que arroja el algoritmo relaciona lo que dicen los textos con las causas predefinidas. Luego se definió un umbral, a partir de la cual se consideró que la similitud con cada una de las causas era suficientemente alta, y que, por lo tanto, existe una probabilidad alta de que la persona que lo escribió se esté refiriendo a esta.
Del total de la base de datos, el algoritmo pudo estimar una medida de similitud independiente para cada una de las nueve causas en 41,509 indicadores (muchos no contienen texto de justificación). De esos registros, 9,830 se corresponden con indicadores que en ese periodo no alcanzaron su meta y son el universo de análisis de este experimento.
¿De qué hablan las personas?
La gráfica a continuación muestra los resultados agregados para responder a la pregunta, ¿de qué causas están hablando las personas cuando escriben sus textos de justificación sobre el incumplimiento en metas de los Programas presupuestales? La primera conclusión es que, en general, se culpan varias causas a la vez. En promedio, encontramos que los textos de justificación coinciden con 2.58 causas.
Cada línea es una de las nueve causas previamente definidas. La que está más arriba es la que más comúnmente se menciona en la base de datos. Esta posición vertical nos permite ver cuáles se mencionan con mayor frecuencia: es un análisis entre causas. También, al seguir una misma línea a través del tiempo podemos ver la tendencia en el tiempo de la frecuencia con la que se mencionan cada una de las causas.
Fuente: Elaboración propia con base en información proporcionada por la UED del PbR - PASH.
La causa más común es la causa 6: “El incumplimiento o inconformidades de proveedores y contratistas, así como por oposición de grupos sociales”, prevalente en más de 70% de las justificaciones. Le siguen la causa 1 “Programación original deficiente”, la causa 8 “Incumplimiento o retraso en los trámites para el ejercicio presupuestario por parte de instancias gubernamentales diferentes a la UR”, la causa 7 “Modificación de atribuciones institucionales por disposiciones normativas” y la causa 8 “Incumplimiento por situaciones normativas extrapresupuestarias ajenas a la UR de la meta”.
¿Cómo utilizar esta información para promover la mejora continua?
Si tú fueses una persona en una posición de toma de decisiones al más alto nivel, esta es la información que necesitas conocer para poder tomar cartas en el asunto. Pero no solo eso, también es información muy relevante para el público en general, personal académico, grupos de incidencia y cualquier persona interesada en mejorar el desempeño de las políticas públicas. Ahora, supongamos que, además de esto, nos interesa conocer la situación en un ramo del gasto o modalidad específica de programa.
Con la información que tenemos en la base de datos se puede replicar la misma gráfica al interior de cada ramo. El ejemplo que se muestra a continuación se refiere sólo al ramo 15: Desarrollo Agrario, Territorial y Urbano. Vemos que las conclusiones cambian ligeramente. El incumplimiento o inconformidades de proveedores y contratistas, así como por oposición de grupos sociales sigue siendo la causa más mencionada, pero ahora las tendencias en el tiempo y los años en los que la mención de las causas alcanza su pico máximo. Esta información nos sirve para saber dónde debemos enfocar la atención si lo que deseamos es mejorar nuestras políticas públicas atacando las causas.
Fuente: Elaboración propia con base en información proporcionada por la UED del PbR - PASH.
Pero el análisis no se detiene ahí. Otra forma de ver esta misma información es mediante listas ordenadas o rankings. El ejercicio que se muestra a continuación se puede realizar para cada una de las causas, pero para este ejemplo tomamos sólo la causa 8: “Incumplimiento por situaciones normativas extrapresupuestarias ajenas a la UR de la meta.” Para ello, podemos crear una lista que nos ayude a responder la pregunta, ¿en qué ramo del gasto es más frecuente la mención de esta causa?
La siguiente gráfica muestra todos los ramos ordenados de acuerdo con la frecuencia relativa con la que una causa es mencionada como aquella por la que los programas no llegan a sus metas. Tres son los ramos del gasto que destacan: Trabajo y Previsión Social, Procuraduría General de la República y Cultura. Los datos que arroja nuestro ejercicio tienen el potencial de convertirse en indicadores de evaluación del desempeño a nivel agregado, además de que este tipo de listados pueden ser una fuente de incentivos para promover la mejora continua y atender directamente las causas que explican aquello que las personas mencionan con más frecuencia.
Fuente: Elaboración propia con base en información proporcionada por la UED del PbR - PASH.
Asimismo, no olvidemos que los Programas presupuestarios son distintos de acuerdo con su modalidad y que las causas que explican el desempeño de los indicadores pueden variar entre distintos tipos de programas. Otra forma de explotar estos datos es creando listados ordenados o rankings por modalidad.
Tomando como ejemplo de nuevo la causa 8: “Incumplimiento por situaciones normativas extrapresupuestarias ajenas a la UR de la meta”, la gráfica a continuación muestra en qué modalidades de gasto es más común que se mencione. En este caso, en los programas de modalidad “R: Específicos” esta causa se menciona en más del 60 por ciento de los casos. Mientras que, en el otro lado del espectro, solo se menciona en 10 por ciento de los que son de la modalidad “I: Gasto federalizado”.
Fuente: Elaboración propia con base en información proporcionada por la UED del PbR - PASH.
Finalmente, es importante mencionar que, gracias a los algoritmos desarrollados por el Laboratorio de Aceleración del PNUD, la información que de origen es de carácter cualitativa y está contenida en las bases de datos del avance de indicadores del Sistema de Evaluación del Desempeño, se puede convertir en datos e inteligencia de interés general sobre el desempeño de las políticas públicas.
Próximamente publicaremos un reporte específico con todo el detalle metodológico de este ejercicio. ¡Espéralo!
En el próximo blog, te contamos cómo operan los principios de inteligencia colectiva y cómo es que este ejercicio tiene el potencial de refinarse con el tiempo y convertirse en una fuente inagotable de aprendizajes para la mejora continua.
¿Tienes experiencia en ciencia de datos y minería de textos? ¿Conoces el Sistema de Evaluación del Desempeño del Gobierno de México? o quieres compartir con nosotros ideas de cómo se puede incorporar tecnología para el diseño de mejoras en el Presupuesto basado en Resultados ¡Escríbenos, queremos escucharte!
BLOG
El cuarto de paz, un mecanismo para el manejo de conflictos en tiempo real (parte 2)
LEER MÁS
BLOG
El cuarto de paz, un mecanismo para el manejo en vivo de conflictos en tiempo real (parte 3)
LEER MÁS
BLOG
El derecho de los pueblos indígenas a la consulta previa, libre e informada
LEER MÁS
BLOG
Problematización del derecho a la consulta indígena en México
LEER MÁS
BLOG
El Cuarto de paz, un mecanismo para el manejo de conflictos en tiempo real (parte 1)
LEER MÁS
Programa de las Naciones Unidas
para el Desarrollo
QUIÉNES SOMOS
Acerca del PNUD
El PNUD y el sistema ONU
Equipo gerencial
Financiamiento y ejecución
Marco jurídico
Nuestro personal
Nuestros socios
QUÉ HACEMOS
Nuestro enfoque
Objetivos de Desarrollo Sostenible
NUESTRO IMPACTO
Blog
Centro de noticias
En los medios
Eventos
Historias
Proyectos
Publicaciones
INVOLÚCRATE
Empleos
Licitaciones
Contacto
Presentar denuncia social o ambiental
Alerta de fraude
Términos de uso
© 2023 Programa de las Naciones Unidas para el Desarrollo


