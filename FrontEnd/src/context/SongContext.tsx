import {createContext, type ReactNode, useCallback, useContext, useEffect, useState} from "react";
import axios from 'axios';


const server = 'http://localhost:5001'

export  interface  Song{
    id: string;
    title:string;
    discription:string;
    audio:string;
    thumbnail:string;
}
export  interface  Album{
    id: string;
    title:string;
    discription:string;
    thumbnail:string;
}

export interface SongContextType{
    songs: Song[];
    song:Song | null;
    isplaying:boolean;
    setIsplaying:(value:boolean) => void;
    loading:boolean;
    selectedSong:string | null;
    setSelectedSong:(id:string | null) => void;
    albums:Album[];
    fetchSingleSong:() => Promise<void>
    nextSong:() => void
    prevSong:() => void
}

const  SongContext = createContext<SongContextType | undefined>(undefined)


interface  SongProviderProps{
    children:ReactNode;
}

export  const SongProvider:React.FC<SongProviderProps> = ({children}) => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedSong, setSelectedSong] = useState<string | null>(null);
  const [isplaying, setIsplaying] = useState<boolean>(false);
  const [albums, setAlbums] = useState<Album[]>([]);


    const fetchSongs = useCallback(async () => {
        setLoading(true);

        try {
            const {data} = await axios.get<Song[]>(`${server}/api/v1/songs`)
            setSongs(data)
            setSelectedSong(data[0].id.toString())
            setIsplaying(false)

            if(data.length > 0){

            }
        } catch (error) {
            console.log(error);
        }finally {
            setLoading(false);
        }

    },[])

    const  [song, setSong] = useState<Song | null>(null)

    const fetchSingleSong = useCallback(async () => {
        try {
            if(!selectedSong) return;

            const {data} = await  axios.get<Song>(`${server}/api/v1/song/${selectedSong}`)

            setSong(data)
        } catch (error) {
            console.error(error);
        }

    },[selectedSong])
    const fetchAlbums = useCallback(async  () => {
        setLoading(true)
        try {
            const  {data} = await axios.get<Album[]>(`${server}/api/v1/albums`)
            setAlbums(data)

        } catch (error) {
            console.log(error);
        }finally {
            setLoading(false);
        }

    },[])

    const [index , setIndex] = useState<number>(0);
    const prevSong = useCallback(async () => {
        if(index > 0){
            setIndex((prev) => prev - 1);
            setSelectedSong(songs[index-1]?.id.toString());
        }
    },[index, songs])

    const nextSong = useCallback(async () => {
        if(index === songs.length - 1){
            setIndex(0)
            setSelectedSong(songs[0].id.toString())
        }else{
            setIndex((prevIndex) => prevIndex + 1)
            setSelectedSong(songs[index+1]?.id.toString())
        }
    },[index, songs])

    useEffect(() => {
        fetchSongs()
        fetchAlbums()
    }, []);
    return(
      <SongContext.Provider value={{songs , loading  ,isplaying , setIsplaying , selectedSong, setSelectedSong, albums, fetchSingleSong, song, prevSong , nextSong}}>
          {children}
      </SongContext.Provider>
  )
}

export  const useSongData = () => {
    const context = useContext(SongContext);
    if(!context){
        throw new Error("useSongData must be used within a SongProvider");
    }
    return context;
}


