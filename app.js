const miModulo = (() => {
  const btnAnterior = document.getElementById("btnAnterior");
  const btnSiguiente = document.getElementById("btnSiguiente");
  let pagina = 1;
  let generos = [];
  let generos_cargados = false;
  btnSiguiente.addEventListener("click", () => {
    if (pagina < 1000) {
      pagina += 1;
      cargarPeliculas();
    }
  });
  btnAnterior.addEventListener("click", () => {
    if (pagina > 1) {
      pagina -= 1;
      cargarPeliculas();
    }
  });

  const cargarPeliculas = async () => {
    //Obtenemos listado de todos los géneros la 1ª vez y almacenamos
    if (!generos_cargados) {
      try {
        const respuesta_genero = await fetch(
          `https://api.themoviedb.org/3/genre/movie/list?api_key=fad7dc3ff06af4d0e301889237359c28&language=es`
        );
        console.log(respuesta_genero);

        if (respuesta_genero.status === 200) {
          const data_genero = await respuesta_genero.json();
          generos = data_genero.genres;

          generos_cargados = true;
        } else {
          console.log("Error al obtener géneros");
        }
      } catch (error) {
        console.log(error);
      }
    }

    //Obtenemos peliculas
    try {
      // con await, espera a que la petición termine para continuar la ejecucion, para implemenatrlo hay que hacer la funcion asincrona con "async".
      const respuesta = await fetch(
        `https://api.themoviedb.org/3/movie/popular?api_key=fad7dc3ff06af4d0e301889237359c28&page=${pagina}&lenguage=es`
      ); //devuelve una promesa
      if (respuesta.status === 200) {
        //con json() accedemos a la información json de la respuesta, tambien es asincrono y por eso se utilzia await
        const data = await respuesta.json();

        let total_pages = data.total_pages;
        document.getElementById(
          "count_pages"
        ).textContent = `${pagina} / ${total_pages}`;
        let movies = "";

        data.results.forEach((movie) => {
          let lista_generos = "| ";
          if (generos_cargados) {
            movie.genre_ids.forEach((genero_id) => {
              const filtered = generos.forEach((genero) => {
                if (genero.id == genero_id) {
                  lista_generos += `${genero.name} | `;
                }
              });
            });
          }

          movies += `
				<div class="pelicula">
					 <img class="poster" src="https://image.tmdb.org/t/p/w500/${movie.poster_path}">
					<h3 class="titulo">${movie.title}</h3>
					<div class="datos">
						<div class="average">${movie.vote_average} </div>
						<div class="generos">${lista_generos}</div>
					</div>

				</div>
				`;
        });
        document.getElementById("contenedor").innerHTML = movies;
      } else if (respuesta.status === 401) {
        console.log("Error de autenticación API");
      } else if (respuesta.status === 404) {
        console.log("Película no encontrada");
      } else {
        console.log("Error");
      }
    } catch (error) {
      console.log(error);
    }
  };

  cargarPeliculas();
})();
