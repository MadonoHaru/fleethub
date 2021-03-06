use std::{
    collections::{hash_map, HashMap},
    hash::Hash,
    iter::FromIterator,
    ops::{Add, AddAssign, Mul},
};

use counter::Counter;
use num_traits::Zero;
use serde::{Deserialize, Deserializer};

#[derive(Debug, Clone, PartialEq)]
pub struct NumMap<K, V>
where
    K: Hash + Eq,
{
    map: HashMap<K, V>,
    zero: V,
}

#[allow(dead_code)]
impl<K, V> NumMap<K, V>
where
    K: Hash + Eq,
    V: Zero,
{
    pub fn new() -> Self {
        HashMap::new().into()
    }

    pub fn get(&self, k: &K) -> &V {
        self.map.get(k).unwrap_or(&self.zero)
    }

    pub fn insert(&mut self, k: K, v: V) -> Option<V> {
        self.map.insert(k, v)
    }

    pub fn entry(&mut self, k: K) -> hash_map::Entry<K, V> {
        self.map.entry(k)
    }

    pub fn iter(&self) -> hash_map::Iter<K, V> {
        self.map.iter()
    }

    pub fn values(&self) -> hash_map::Values<K, V> {
        self.map.values()
    }

    pub fn into_vec(self) -> Vec<(K, V)> {
        self.into_iter().collect()
    }
}

impl<K, V> From<HashMap<K, V>> for NumMap<K, V>
where
    K: Hash + Eq,
    V: Zero,
{
    fn from(map: HashMap<K, V>) -> Self {
        Self {
            map,
            zero: V::zero(),
        }
    }
}

impl<K, V> FromIterator<(K, V)> for NumMap<K, V>
where
    K: Hash + Eq,
    V: Zero,
{
    fn from_iter<T: IntoIterator<Item = (K, V)>>(iter: T) -> Self {
        iter.into_iter().collect::<HashMap<K, V>>().into()
    }
}

impl<K, V> IntoIterator for NumMap<K, V>
where
    K: Hash + Eq,
{
    type Item = (K, V);
    type IntoIter = hash_map::IntoIter<K, V>;

    fn into_iter(self) -> Self::IntoIter {
        self.map.into_iter()
    }
}

impl<K, V, const N: usize> From<[(K, V); N]> for NumMap<K, V>
where
    K: Hash + Eq + Clone,
    V: Zero + Clone,
{
    fn from(array: [(K, V); N]) -> Self {
        array.iter().cloned().collect()
    }
}

impl<K> From<Counter<K>> for NumMap<K, usize>
where
    K: Hash + Eq,
{
    fn from(counter: Counter<K>) -> Self {
        counter.into_map().into()
    }
}

impl<K, V> AddAssign<(K, V)> for NumMap<K, V>
where
    K: Hash + Eq,
    V: AddAssign + Zero,
{
    fn add_assign(&mut self, (key, value): (K, V)) {
        let entry = self.entry(key).or_insert_with(V::zero);
        *entry += value;
    }
}

impl<K, V> AddAssign for NumMap<K, V>
where
    K: Hash + Eq,
    V: AddAssign + Zero,
{
    fn add_assign(&mut self, rhs: Self) {
        for item in rhs.map.into_iter() {
            self.add_assign(item)
        }
    }
}

impl<K, V> Add for NumMap<K, V>
where
    K: Hash + Eq,
    V: AddAssign + Zero,
{
    type Output = Self;

    fn add(mut self, rhs: Self) -> Self::Output {
        self += rhs;
        self
    }
}

impl<K, V> Mul<V> for NumMap<K, V>
where
    K: Hash + Eq,
    V: Clone + Mul<Output = V> + Zero,
{
    type Output = NumMap<K, V>;

    fn mul(self, rhs: V) -> Self::Output {
        self.into_iter()
            .map(|(k, v)| (k, v * rhs.clone()))
            .collect::<NumMap<K, V>>()
    }
}

#[cfg(test)]
mod test {
    use super::NumMap;

    #[test]
    fn test_num_map() {
        let map0: NumMap<&str, f64> = [("a", 2.), ("b", 3.)].into();
        let map1: NumMap<&str, f64> = [("b", 4.), ("c", 5.)].into();

        assert_eq!(
            map0.clone() + map1,
            [("a", 2.), ("b", 7.), ("c", 5.)].into()
        );
        assert_eq!(map0 * 3., [("a", 6.), ("b", 9.)].into());

        let mut map2: NumMap<&str, i32> = [("x", 1), ("y", 2)].into();
        let map3: NumMap<&str, i32> = [("x", 3), ("y", 4)].into();
        map2 += map3;

        assert_eq!(map2, [("x", 4), ("y", 6)].into());
    }
}
