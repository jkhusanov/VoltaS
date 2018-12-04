# VoltaS

My implementation of Volta Code Challenge

<p align="center">
  <a href="https://github.com/jkhusanov/VoltaS">
    <img alt="VoltaS" src="assets/icon.png" width="250">
  </a>
</p>

<h3 align="center">
  VoltaS
</h3>

<a href="https://github.com/Volta-Charging/data-applications-challenge">
<p align="center">
  Volta Code Challenge Implementation 
</p>
</a>

## What's VoltaS?

**Your best helper to fiend Volta stations**

- Users can **discover stations around** using interactive map
- Get **directions to stations**
- They can also **save stations** on their saved stations list, so they have instant access to them and get information about their favorite stations

## Getting started, with app client

### [Demo - Try it on Expo](https://expo.io/@jkhusanov/VoltaS)

Assuming that you have [Node, Expo CLI](https://facebook.github.io/react-native/docs/getting-started.html), and [Yarn](https://yarnpkg.com/en/) installed:

```
git clone https://github.com/jkhusanov/VoltaS.git

cd VoltaS

yarn install

expo start

i
```

## TODO

- [x] Implement **Navigation**
- [x] **Redux** setup and connect to the **Volta's endpoint**
- [x] Show stations on the MapScreen
- [x] Implement modal view for stations info
- [x] Implement **directions** to a station
- [x] Implement **save** station option
- [x] Improve station info modal on MapScreen
  - [x] Add star or bookmark button for save
- [x] **Cluster** markers
  - [x] Clusters render view change
- [x] Improve station info card on SavedScreen
  - [x] Show the address of a station
  - [x] Add individual station deletion option
- [x] Add **custom markers** image/view
- [x] Add current location button on MapScreen
- [x] Publish and README update

## Demo

![Demo gif](https://github.com/jkhusanov/VoltaS/blob/master/screenshots/demo_voltas.gif)
