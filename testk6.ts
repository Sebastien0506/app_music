import http from 'k6/http';
import { sleep, check } from 'k6';
import { Trend, Counter } from 'k6/metrics';

const BASE_URL = 'http://nginx:80';

const params = {
    headers: {
        Host: 'localhost',
    },
};

const getMusicDuration = new Trend('get_music_duration', true);
const listenMusicDuration = new Trend('listen_music_duration', true);
const filterMusicDuration = new Trend('filter_music_duration', true);
const downloadMusicDuration = new Trend('download_music_duration', true); 

const downloadMusicRequest = new Counter('download_music_requests');
const getMusicRequests = new Counter('get_music_requests');
const listenMusicRequests = new Counter('listen_music_requests');
const filterMusicRequests = new Counter('filter_music_requests');

export const options = {
    scenarios: {
        recuperer_musiques: {
            executor: 'constant-vus',
            vus: 250,
            duration: '30s',
            exec: 'getMusic',
        },

        // ecouter_musiques: {
        //     executor: 'constant-vus',
        //     vus: 55,
        //     duration: '30s',
        //     exec: 'listenMusic',
        // },

        // download_music: {
        //     executor: 'constant-vus',
        //     vus: 50,
        //     duration: '30s',
        //     exec: 'downloadMusic',
        // },

        filtrer_musiques: {
            executor: 'constant-vus',
            vus: 250,
            duration: '30s',
            exec: 'filterMusic',
        },
    },
};

// 20 utilisateurs récupèrent les musiques
export function getMusic() {
    const response = http.get(
        `${BASE_URL}/api/get_all_music/`,
        params
    );
    getMusicDuration.add(response.timings.duration);
    getMusicRequests.add(1);
    check(response, {
        'Récupération musiques HTTP 200': (r) => r.status === 200,
    });

    if (response.status !== 200) {
        console.error(
            `Status: ${response.status} | ` +
            `Erreur: ${response.error} | ` +
            `Code: ${response.error_code}`
        );
    }

    sleep(1);
}

// 30 utilisateurs écoutent des musiques
export function listenMusic() {
    const response = http.get(
        `${BASE_URL}/media/music/23e51285-f15c-4aa2-a999-d5cac3180c79.mp3`,
        {
            ...params,
            responseType: 'none'
        }
        
    );
    listenMusicRequests.add(1);
    listenMusicDuration.add(response.timings.duration);
    console.log(`Lecture MP3 : HTTP ${response.status}`);
    check(response, {
        'Lecture musique HTTP 200': (r) => r.status === 200,
        
    });

    if (response.status !== 200) {
        console.error(
            `Status: ${response.status} | ` +
            `Erreur: ${response.error} | ` +
            `Code: ${response.error_code}`
        );
    }

    sleep(1);
}

// 25 utilisateurs filtrent les musiques
export function filterMusic() {
    const response = http.get(
        `${BASE_URL}/api/filter_music_by_like/`,
        params
    );
     filterMusicRequests.add(1);
    filterMusicDuration.add(response.timings.duration);
    check(response, {
        'Filtrage musiques HTTP 200': (r) => r.status === 200,
    });

    sleep(1);
}

export function downloadMusic() {
  const response = http.get(
       `${BASE_URL}/api/download_music/10/`,
    {
        ...params,
        responseType: 'none',
        redirect: 0
    }
  );

  console.log(`HTTP : ${response.status}`);

   console.log(`Location : ${response.headers['Location']}`);
  downloadMusicRequest.add(1);
  downloadMusicDuration.add(response.timings.duration);

  check(
    response, 
    {
        'Téléchargement musique HTTP 200': (r) => r.status === 200,
    }
  );
  sleep(1);

}