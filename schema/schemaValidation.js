import { z } from "zod";

const schoolSchema = z.object({
    name: z.string().min(1, "Name is required!"),
    address: z.string().min(1, "Address is required!"),
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-90).max(90)

});

export default schoolSchema;