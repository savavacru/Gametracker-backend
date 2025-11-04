import mongoose from "mongoose";

const connectDB = async () => {
    try{
        // Opciones de conexión para resolver problemas de SSL con Node.js 22+
        const options = {
            retryWrites: true,
            w: 'majority',
            serverSelectionTimeoutMS: 5000,
            // Opciones SSL adicionales para compatibilidad
            tls: true,
            tlsAllowInvalidCertificates: false,
            tlsAllowInvalidHostnames: false,
        };

        const conn = await mongoose.connect(process.env.MONGODB_URI, options);
        console.log(`✅ MongoDB conectado exitosamente a: ${conn.connection.host}`);
    } catch (error){
        console.error(`❌ Error al conectar a MongoDB:`, error.message);
        console.error('Detalles del error:', error);
        process.exit(1);
    }
}
export default connectDB;