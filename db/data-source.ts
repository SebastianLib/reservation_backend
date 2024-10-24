import {DataSource, DataSourceOptions} from "typeorm"
import {config} from "dotenv"

config()

export const dataSourceOptions:DataSourceOptions={
    type:"mysql",
    host: process.env.DB_HOST,
    port:Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: ['dist/**/*.entity{.ts,.js}'],
    migrations:[],
    // migrations:['dist/db/migrations/*{.ts,.js}'],
    logging: false,
    synchronize: true,
}

const dataSource = new DataSource(dataSourceOptions);
dataSource.initialize()
export default dataSource;