import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = { detail: { stations: [] }, status: 'loading' };

export const fetchDetails = createAsyncThunk(
  'detail/fetchDetail',
  async (id) => {
    const response = await fetch(`http://api.citybik.es/v2/networks/${id}`);
    return response.json();
  },
);

const detailSlice = createSlice({
  name: 'detail',
  initialState,
  reducers: {
    resetDetails: () => ({ detail: { stations: [] }, status: 'loading' }),
  },
  extraReducers(builder) {
    builder.addCase(fetchDetails.fulfilled, (state, { payload }) => {
      const dataObj = {
        name: payload.network.name,
        city: payload.network.location.city,
        country: payload.network.location.country,
        company: payload.network.company,
        latitude: payload.network.location.latitude,
        longitude: payload.network.location.longitude,
        stations: payload.network.stations,
      };
      return { ...state, detail: dataObj };
    });
  },
});

export const { resetDetails } = detailSlice.actions;
export default detailSlice.reducer;
